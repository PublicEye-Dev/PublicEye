package com.appbackend.backend.service.category;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appbackend.backend.dto.CategoryCreateRequest;
import com.appbackend.backend.dto.CategoryResponse;
import com.appbackend.backend.dto.PagedResponse;
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
    public PagedResponse<CategoryResponse> getCategoriesForDisplay(
            Long departmentId,
            String departmentName,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        int validatedPage = Math.max(page, 0);
        int validatedSize = size <= 0 ? 10 : size;
        String validatedSortBy = (sortBy == null || sortBy.isBlank()) ? "name" : sortBy;
        Sort.Direction direction;
        try {
            direction = Sort.Direction.fromString(sortDir);
        } catch (Exception ex) {
            direction = Sort.Direction.ASC;
        }

        Pageable pageable = PageRequest.of(validatedPage, validatedSize, Sort.by(direction, validatedSortBy));
        Specification<Category> spec = CategorySpecification.withFilters(departmentId, departmentName);

        Page<Category> result = categoryRepository.findAll(spec, pageable);

        List<CategoryResponse> content = result.getContent().stream()
                .map(CategoryResponse::from)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isFirst(),
                result.isLast()
        );
    }

    @Override
    public List<CategoryResponse> getAllCategoriesAsList() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryResponse::from)
                .collect(Collectors.toList());
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

    @Override
    @Transactional
    public Category addSubcategoryToCategory(Long categoryId, Long subcategoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Categoria nu a fost gasita"));

        Subcategory subcategory = subcategoryRepository.findById(subcategoryId)
                .orElseThrow(() -> new EntityNotFoundException("Subcategoria nu a fost gasita"));

        // Forțează inițializarea lazy loading pentru a accesa categoria curentă
        Category currentCategory = subcategory.getCategory();

        // Dacă subcategoria aparține deja unei alte categorii, o detașăm din categoria veche
        if (currentCategory != null && !currentCategory.getId().equals(categoryId)) {
            // Asigură-te că lista de subcategorii este inițializată
            currentCategory.getSubcategories().size(); // Forțează inițializarea lazy
            currentCategory.getSubcategories().remove(subcategory);
            categoryRepository.saveAndFlush(currentCategory); // Salvează și flush categoria veche
        }

        // Asigură-te că lista de subcategorii este inițializată
        category.getSubcategories().size(); // Forțează inițializarea lazy
        // Dacă subcategoria nu este deja în categoria nouă, o adăugăm
        if (!category.getSubcategories().contains(subcategory)) {
            category.getSubcategories().add(subcategory);
        }

        // Setăm noua categorie pentru subcategorie
        subcategory.setCategory(category);
        subcategoryRepository.saveAndFlush(subcategory);

        // Salvează categoria nouă și returnează-o
        return categoryRepository.saveAndFlush(category);
    }

    @Override
    public Category updateDetails(Long categoryId, CategoryCreateRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Categoria nu a fost gasita"));

        if(request.departmentId() != null) {
            Department department = departmentRepository.findById(request.departmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Departamentul nu a fost gasit"));
            category.setDepartment(department);
        }
        if(request.name() != null && !request.name().equals(category.getName())) {
            category.setName(request.name());
        }
        return categoryRepository.save(category);
    }
}
