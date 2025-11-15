package com.appbackend.backend.dto;

import com.appbackend.backend.entity.Complaint;
import com.appbackend.backend.enums.Status;

import java.time.LocalDateTime;

public record ComplaintDto(
        Long id,
        String description,
        String imageUrl,
        String imagePublicId,
        int votes,
        Status status,
        Double latitude,
        Double longitude,
        Long categoryId,
        String categoryName,
        Long subcategoryId,
        Long userId,
        String createdAt
) {
    public static ComplaintDto from(Complaint complaint) {
        return new ComplaintDto(
                complaint.getId(),
                complaint.getDescription(),
                complaint.getImageUrl(),
                complaint.getImagePublicId(),
                complaint.getVotes(),
                complaint.getStatus(),
                complaint.getLatitude(),
                complaint.getLongitude(),
                complaint.getCategory().getId(),
                complaint.getCategory().getName(),
                complaint.getSubcategory().getId(),
                complaint.getUser().getId(),
                complaint.getCreatedAt().toString()
        );
    }
}