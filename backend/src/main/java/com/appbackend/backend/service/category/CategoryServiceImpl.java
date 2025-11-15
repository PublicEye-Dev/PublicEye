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
    public Category updateSubcategories(Long categoryId, Long newSubcategoryId, Long exSubcategoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Categoria nu a fost gasita"));

        Subcategory exSubcategory = subcategoryRepository.findById(exSubcategoryId)
                .orElseThrow(() -> new EntityNotFoundException("Subcategoria veche nu a fost gasita"));

        Subcategory newSubcategory = subcategoryRepository.findById(newSubcategoryId)
                .orElseThrow(() -> new EntityNotFoundException("Subcategoria noua nu a fost gasita"));

        if (exSubcategory.equals(newSubcategory)) {
            throw new IllegalArgumentException("Subcategoriile trebuie sa difere!");
        }

        // Verificăm dacă subcategoria veche aparține categoriei
        if (!category.getSubcategories().contains(exSubcategory)) {
            throw new IllegalArgumentException("Categoria veche nu aparține acestui departament!");
        }

        // Verificăm dacă subcategoria nouă nu aparține deja altei categorii
        if (newSubcategory.getCategory() != null && !newSubcategory.getCategory().equals(category)) {
            throw new IllegalStateException("Subcategoria nouă aparține deja altei categorii!");
        }

        // Actualizăm relația bidirecțională
        category.getSubcategories().remove(exSubcategory);
        category.getSubcategories().add(newSubcategory);

        // Actualizăm referința categorie pe subcategorii
        subcategoryRepository.delete(exSubcategory);
        newSubcategory.setCategory(category);

        // Salvăm categoriile pentru a actualiza relația în DB
        subcategoryRepository.save(newSubcategory);

        return categoryRepository.save(category);

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
