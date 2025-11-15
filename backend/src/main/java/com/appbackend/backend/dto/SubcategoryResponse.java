package com.appbackend.backend.dto;

import com.appbackend.backend.entity.Subcategory;

public record SubcategoryResponse(
        Long id,
        String name,
        Long categoryId,
        String categoryName
) {
    public static SubcategoryResponse from(Subcategory subcategory) {
        return new SubcategoryResponse(
                subcategory.getId(),
                subcategory.getName(),
                subcategory.getCategory().getId(),
                subcategory.getCategory().getName()
        );
    }
}
