package com.appbackend.backend.service.complaint;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.appbackend.backend.dto.ComplaintDto;
import com.appbackend.backend.entity.Category;
import com.appbackend.backend.entity.Complaint;
import com.appbackend.backend.entity.Subcategory;
import com.appbackend.backend.entity.User;
import com.appbackend.backend.enums.Status;
import com.appbackend.backend.repository.CategoryRepository;
import com.appbackend.backend.repository.ComplaintRepository;
import com.appbackend.backend.repository.SubcategoryRepository;
import com.appbackend.backend.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final UserRepository userRepository;
    private final FileUploadService fileUploadService;

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

    @Transactional(readOnly = true)
    public List<ComplaintDto> listComplaints(List<String> statuses, String period) {
        LocalDateTime startDate;
        
        if (period.equals("30z")) {
            startDate = LocalDateTime.now().minusDays(30);
        } else if (period.equals("1year")) {
            startDate = LocalDateTime.now().minusYears(1);
        } else {
            // Dacă perioada nu este validă, folosim ultimele 30 zile ca default
            startDate = LocalDateTime.now().minusDays(30);
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
            if (period.equals("30z")) {
                complaints = complaintRepository.findAllFromLastMonth(startDate);
            } else {
                complaints = complaintRepository.findAllFromLastYear(startDate);
            }
        }

        return complaints.stream()
                .map(ComplaintDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComplaintDto updateStatus(Long id, Status newStatus) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sesizarea nu există"));
        complaint.setStatus(newStatus);
        return ComplaintDto.from(complaint);
    }

    @Transactional
    public ComplaintDto upvote(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sesizarea nu există"));
        complaint.setVotes(complaint.getVotes() + 1);
        return ComplaintDto.from(complaint);
    }
}