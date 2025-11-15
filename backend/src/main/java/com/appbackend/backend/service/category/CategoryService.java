package com.appbackend.backend.service.category;

import java.util.List;

import com.appbackend.backend.dto.CategoryCreateRequest;
import com.appbackend.backend.dto.CategoryResponse;
import com.appbackend.backend.dto.PagedResponse;
import com.appbackend.backend.entity.Category;

public interface CategoryService {

    Category createCategory(CategoryCreateRequest request);
    Category getCategoryById(Long id);
    void deleteCategoryById(Long id);
    PagedResponse<CategoryResponse> getCategoriesForDisplay(
            Long departmentId,
            String departmentName,
            int page,
            int size,
            String sortBy,
            String sortDir);
    List<CategoryResponse> getAllCategoriesAsList();
    List<Category> getAllCategoriesByDepartmentId(Long departmentId);
    List<Category> searchCategories(String keyword);
    Category addSubcategoryToCategory(Long categoryId, Long subcategoryId);
    Category removeSubcategoryFromCategory(Long categoryId, Long subcategoryId);
    Category updateDetails(Long categoryId, CategoryCreateRequest request);
}
