package com.appbackend.backend.service.category;

import java.util.List;

import com.appbackend.backend.dto.CategoryCreateRequest;
import com.appbackend.backend.entity.Category;

public interface CategoryService {

    Category createCategory(CategoryCreateRequest request);
    Category getCategoryById(Long id);
    void deleteCategoryById(Long id);
    List<Category> getAllCategories();
    List<Category> getAllCategoriesByDepartmentId(Long departmentId);
    List<Category> searchCategories(String keyword);
}
