package com.appbackend.backend.dto;

import com.appbackend.backend.entity.Category;

public record CategoryResponse(
        Long id,
        String name,
        Long departmentId
) {
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDepartment() != null ? category.getDepartment().getId() : null
        );
    }
}