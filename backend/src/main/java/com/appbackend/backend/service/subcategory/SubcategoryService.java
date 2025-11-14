package com.appbackend.backend.service.subcategory;

import java.util.List;

import com.appbackend.backend.dto.PagedResponse;
import com.appbackend.backend.dto.SubcategoryCreateRequest;
import com.appbackend.backend.dto.SubcategoryResponse;
import com.appbackend.backend.entity.Subcategory;

public interface SubcategoryService {
    public PagedResponse<SubcategoryResponse> getAllSubcategories(int page, int size, Long categoryId);
    public Subcategory getSubcategoryById(Long id);
    public Subcategory addSubcategory(SubcategoryCreateRequest request);
    public Subcategory updateSubcategory(Long id, SubcategoryCreateRequest request);
    public void deleteSubcategory(Long id);
    public List<Subcategory> getSubcategoriesByCategoryId(Long id);
    
}
