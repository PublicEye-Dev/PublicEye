package com.appbackend.backend.controller;

import com.appbackend.backend.dto.ComplaintCreateRequest;
import com.appbackend.backend.dto.ComplaintDto;
import com.appbackend.backend.enums.Status;
import com.appbackend.backend.service.complaint.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

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
}