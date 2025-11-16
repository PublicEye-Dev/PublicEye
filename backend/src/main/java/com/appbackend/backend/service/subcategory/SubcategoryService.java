package com.appbackend.backend.service.subcategory;

import java.util.List;

import com.appbackend.backend.dto.PagedResponse;
import com.appbackend.backend.dto.SubcategoryCreateRequest;
import com.appbackend.backend.dto.SubcategoryResponse;
import com.appbackend.backend.entity.Subcategory;

public interface SubcategoryService {
    PagedResponse<SubcategoryResponse> getAllSubcategories(int page, int size, Long categoryId, String categoryName);
    List<SubcategoryResponse> getAllSubcategoriesList(Long categoryId);
    Subcategory getSubcategoryById(Long id);
    Subcategory addSubcategory(SubcategoryCreateRequest request);
    Subcategory updateSubcategory(Long id, SubcategoryCreateRequest request);
    void deleteSubcategory(Long id);
    List<Subcategory> getSubcategoriesByCategoryId(Long id);
    List<SubcategoryResponse> getAvailableSubcategories(Long categoryId);
}
