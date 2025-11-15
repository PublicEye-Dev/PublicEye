package com.appbackend.backend.service.complaint;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.appbackend.backend.dto.ComplaintDto;
import com.appbackend.backend.dto.PagedResponse;
import com.appbackend.backend.entity.Category;
import com.appbackend.backend.entity.Complaint;
import com.appbackend.backend.entity.ComplaintVote;
import com.appbackend.backend.entity.Subcategory;
import com.appbackend.backend.entity.User;
import com.appbackend.backend.enums.Status;
import com.appbackend.backend.repository.CategoryRepository;
import com.appbackend.backend.repository.ComplaintRepository;
import com.appbackend.backend.repository.ComplaintVoteRepository;
import com.appbackend.backend.repository.SubcategoryRepository;
import com.appbackend.backend.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final UserRepository userRepository;
    private final FileUploadService fileUploadService;
    private final ComplaintVoteRepository complaintVoteRepository;

    @Override
    @Transactional
    public ComplaintDto createComplaint(String description,
                                        Long categoryId,
                                        Long subcategoryId,
                                        Long userId,
                                        MultipartFile image,
                                        Double latitude,
                                        Double longitude) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilizatorul nu există"));
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Categoria nu există"));
        Subcategory subcategory = subcategoryRepository.findById(subcategoryId)
                .orElseThrow(() -> new EntityNotFoundException("Subcategoria nu există"));

        FileUploadService.UploadedImage uploaded = fileUploadService.uploadImage(image);

        Complaint complaint = new Complaint();
        complaint.setDescription(description);
        complaint.setCategory(category);
        complaint.setSubcategory(subcategory);
        complaint.setUser(user);
        complaint.setImageUrl(uploaded.secureUrl());
        complaint.setImagePublicId(uploaded.publicId());
        complaint.setLatitude(latitude);
        complaint.setLongitude(longitude);
        complaint.setStatus(Status.DEPUSA);

        return ComplaintDto.from(complaintRepository.save(complaint));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintDto> listComplaints(List<String> statuses, String period) {
        LocalDateTime startDate;
        switch (period) {
            case "30z":
                startDate = LocalDateTime.now().minusDays(30);
                break;
            case "1year":
                startDate = LocalDateTime.now().minusYears(1);
                break;
            default:
                startDate = LocalDateTime.now().minusDays(30);
                break;
        }

        List<Complaint> complaints;
        
        // Convertim List<String> în List<Status>
        if (statuses != null && !statuses.isEmpty()) {
            List<Status> statusList = statuses.stream()
                    .map(statusStr -> {
                        try {
                            return Status.valueOf(statusStr.toUpperCase());
                        } catch (IllegalArgumentException e) {
                            return null;
                        }
                    })
                    .filter(status -> status != null)
                    .collect(Collectors.toList());
            
            if (!statusList.isEmpty()) {
                complaints = complaintRepository.findByStatusesAndCreatedAtAfter(statusList, startDate);
            } else {
                // Dacă nu există statusuri valide, returnăm lista goală
                return new ArrayList<>();
            }
        } else {
            // Dacă nu sunt specificate statusuri, returnăm toate complaints-urile din perioada respectivă
            switch (period) {
                case "30z":
                    complaints = complaintRepository.findAllFromLastMonth(startDate);
                    break;
                case "1year":
                    complaints = complaintRepository.findAllFromLastYear(startDate);
                    break;
                default:
                    complaints = complaintRepository.findAllFromLastMonth(startDate);
                    break;
            }
        }

        return complaints.stream()
                .map(ComplaintDto::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ComplaintDto updateStatus(Long id, Status newStatus) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sesizarea nu există"));
        complaint.setStatus(newStatus);
        Complaint updatedComplaint = complaintRepository.save(complaint);
        return ComplaintDto.from(updatedComplaint);
    }

    @Override
    @Transactional
    public ComplaintDto upvote(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sesizarea nu există"));

        User currentUser = getCurrentUser();

        if (complaintVoteRepository.existsByComplaint_IdAndUser_Id(complaint.getId(), currentUser.getId())) {
            throw new IllegalStateException("Ai votat deja această sesizare");
        }

        ComplaintVote vote = new ComplaintVote();
        vote.setComplaint(complaint);
        vote.setUser(currentUser);
        complaintVoteRepository.save(vote);

        complaint.setVotes(complaint.getVotes() + 1);
        Complaint updatedComplaint = complaintRepository.save(complaint);
        return ComplaintDto.from(updatedComplaint);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ComplaintDto> getComplaintsWithFilters(
            Long categoryId,
            Long subcategoryId,
            List<String> statusStrings,
            Pageable pageable) {

        // Convertim statusurile din String în Status enum
        List<Status> statuses = null;
        if (statusStrings != null && !statusStrings.isEmpty()) {
            statuses = statusStrings.stream()
                    .map(statusStr -> {
                        try {
                            return Status.valueOf(statusStr.toUpperCase());
                        } catch (IllegalArgumentException e) {
                            return null;
                        }
                    })
                    .filter(status -> status != null)
                    .collect(Collectors.toList());
        }

        // Construim Specification pentru filtrare
        Specification<Complaint> spec = ComplaintSpecification.withFilters(
                categoryId,
                subcategoryId,
                statuses
        );

        // Executăm query-ul cu paginare
        Page<Complaint> page = complaintRepository.findAll(spec, pageable);

        // Convertim în DTO-uri
        List<ComplaintDto> content = page.getContent().stream()
                .map(ComplaintDto::from)
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintDto> searchComplaints(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return new ArrayList<>();
        }

        Specification<Complaint> spec = ComplaintSpecification.searchByKeyword(keyword.trim());
        List<Complaint> complaints = complaintRepository.findAll(spec);

        return complaints.stream()
                .map(ComplaintDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public ComplaintDto getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sesizarea nu exista"));
        return ComplaintDto.from(complaint);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintDto> getComplaintsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilizatorul nu există"));

        return complaintRepository.findByUser_Id(user.getId()).stream()
                .map(ComplaintDto::from)
                .collect(Collectors.toList());
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User authenticatedUser) {
            return userRepository.findById(authenticatedUser.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Utilizatorul nu există"));
        }
        throw new IllegalStateException("Utilizatorul nu este autentificat");
    }
}