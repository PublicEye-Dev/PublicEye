package com.appbackend.backend.service.category;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appbackend.backend.dto.CategoryCreateRequest;
import com.appbackend.backend.entity.Category;
import com.appbackend.backend.entity.Department;
import com.appbackend.backend.entity.Subcategory;
import com.appbackend.backend.repository.CategoryRepository;
import com.appbackend.backend.repository.DepartmentRepository;
import com.appbackend.backend.repository.SubcategoryRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final DepartmentRepository departmentRepository;
    private final SubcategoryRepository subcategoryRepository;

    @Override
    @Transactional
    public Category createCategory(CategoryCreateRequest request) {
        Department department = null;
        if (request.departmentId() != null) {
            department = departmentRepository.findById(request.departmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Departamentul nu a fost găsit"));
            if (categoryRepository.existsByNameIgnoreCaseAndDepartmentId(request.name(), request.departmentId())) {
                throw new IllegalArgumentException("Categoria există deja pentru departamentul selectat");
            }
        } else {
            if (categoryRepository.findByName(request.name()).isPresent()) {
                throw new IllegalArgumentException("Categoria există deja");
            }
        }

        Category category = new Category();
        category.setName(request.name());
        category.setDepartment(department);

        return categoryRepository.save(category);
    }

    @Override
    public Category getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoria nu a fost gasita"));
        return category;
    }

    @Override
    public void deleteCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoria nu a fost gasita"));
        for(Subcategory subcategory : category.getSubcategories()) {
            subcategoryRepository.delete(subcategory);
        }
        categoryRepository.delete(category);

    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public List<Category> getAllCategoriesByDepartmentId(Long departmentId) {
        if(departmentRepository.existsById(departmentId)) {
            return categoryRepository.findByDepartment_Id(departmentId);
        }
        else throw new EntityNotFoundException("Departamentul nu a fost gasit");
    }

    @Override
    public List<Category> searchCategories(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return new ArrayList<>();
        }

        return categoryRepository.findAll(
                CategorySpecification.searchByKeyword(keyword.trim())
        );
    }
}
