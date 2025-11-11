package com.appbackend.backend.service.complaint;

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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

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

        String imageUrl = fileUploadService.uploadFile(image);

        Complaint complaint = new Complaint();
        complaint.setDescription(description);
        complaint.setCategory(category);
        complaint.setSubcategory(subcategory);
        complaint.setUser(user);
        complaint.setImageUrl(imageUrl);
        complaint.setLatitude(latitude);
        complaint.setLongitude(longitude);
        complaint.setStatus(Status.DEPUSA);

        return ComplaintDto.from(complaintRepository.save(complaint));
    }

    @Transactional(readOnly = true)
    public List<ComplaintDto> listComplaints(Status status) {
        List<Complaint> complaints = status == null
                ? complaintRepository.findAll()
                : complaintRepository.findAllByStatus(status);
        return complaints.stream().map(ComplaintDto::from).toList();
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