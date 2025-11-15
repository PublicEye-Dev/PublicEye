package com.appbackend.backend.dto;

import com.appbackend.backend.entity.Department;

import java.util.List;

public record DepartmentResponse(
        Long id,
        String name,
        String description,
        List<CategoryResponse> categories
) {
    public static DepartmentResponse from(Department department) {
        List<CategoryResponse> categoryResponses = department.getCategories() == null
                ? List.of()
                : department.getCategories().stream()
                .map(CategoryResponse::from)
                .toList();

        return new DepartmentResponse(
                department.getId(),
                department.getName(),
                department.getDescription(),
                categoryResponses
        );
    }
}