package com.appbackend.backend.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.appbackend.backend.dto.ComplaintCreateRequest;
import com.appbackend.backend.dto.ComplaintDto;
import com.appbackend.backend.dto.PagedResponse;
import com.appbackend.backend.enums.Status;
import com.appbackend.backend.service.complaint.ComplaintService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
 @PreAuthorize("hasAnyRole('USER')")
public class ComplaintController {

    private final ComplaintService complaintService;

    @PreAuthorize("hasAnyRole('USER')")
    @PostMapping(path = "/add-complaint", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ComplaintDto> createComplaint(
            @Valid @RequestPart("data") ComplaintCreateRequest request,
            @RequestPart("image") MultipartFile image) throws IOException {

        ComplaintDto created = complaintService.createComplaint(
                request.description(),
                request.categoryId(),
                request.subcategoryId(),
                request.userId(),
                image,
                request.latitude(),
                request.longitude()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'OPERATOR')")
    @GetMapping()
    public ResponseEntity<List<ComplaintDto>> listComplaints(
            @RequestParam(name = "status", required = false) List<String> statuses,
            @RequestParam(name = "perioada", required = false, defaultValue = "30z") String period) {

        return ResponseEntity.ok(complaintService.listComplaints(statuses, period));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ComplaintDto> updateStatus(
            @PathVariable Long id,
            @RequestParam Status status) {

        return ResponseEntity.ok(complaintService.updateStatus(id, status));
    }

    @PreAuthorize("hasAnyRole('USER')")
    @PostMapping("/{id}/vote")
    public ResponseEntity<ComplaintDto> upvote(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.upvote(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @GetMapping("/paginated")
    public ResponseEntity<PagedResponse<ComplaintDto>> getComplaintsPaginated(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long subcategoryId,
            @RequestParam(required = false) List<String> status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        // Construim Pageable cu sortare
        Sort sort = sortDir.equalsIgnoreCase("ASC")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(complaintService.getComplaintsWithFilters(
                categoryId,
                subcategoryId,
                status,
                pageable
        ));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @GetMapping("/search")
    public ResponseEntity<List<ComplaintDto>> searchComplaints(
            @RequestParam(name = "q", required = true) String keyword) {
        
        return ResponseEntity.ok(complaintService.searchComplaints(keyword));
    }
}