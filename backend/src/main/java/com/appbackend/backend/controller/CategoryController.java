package com.appbackend.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appbackend.backend.dto.CategoryCreateRequest;
import com.appbackend.backend.dto.CategoryResponse;
import com.appbackend.backend.dto.PagedResponse;
import com.appbackend.backend.entity.Category;
import com.appbackend.backend.service.category.CategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor

public class CategoryController {

    private final CategoryService categoryService;

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @PostMapping("/create-category")
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryCreateRequest request) {
        Category category = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CategoryResponse.from(category));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @GetMapping
    public ResponseEntity<PagedResponse<CategoryResponse>> getAllCategories(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String departmentName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir) {

        PagedResponse<CategoryResponse> categories = categoryService.getCategoriesForDisplay(
                departmentId,
                departmentName,
                page,
                size,
                sortBy,
                sortDir
        );
        return ResponseEntity.ok(categories);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'USER')")
    @GetMapping("/list")
    public ResponseEntity<List<CategoryResponse>> getAllCategoriesList() {
        List<CategoryResponse> categories = categoryService.getAllCategoriesAsList();
        return ResponseEntity.ok(categories);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'USER')")
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(CategoryResponse.from(category));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @PutMapping("/{id}/details")
    public ResponseEntity<CategoryResponse> updateCategoryDetails(
            @PathVariable Long id,
            @Valid @RequestBody CategoryCreateRequest request
    ) {
        Category category = categoryService.updateDetails(id, request);
        return ResponseEntity.ok(CategoryResponse.from(category));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategoryById(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<CategoryResponse>> getCategoriesByDepartment(@PathVariable Long  departmentId) {
        List<CategoryResponse> categories = categoryService.getAllCategoriesByDepartmentId(departmentId)
                .stream()
                .map(CategoryResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @GetMapping("/search")
    public ResponseEntity<List<CategoryResponse>> searchCategories(@RequestParam String keyword) {
        List<CategoryResponse> categories = categoryService.searchCategories(keyword)
                .stream()
                .map(CategoryResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @PostMapping("/{categoryId}/subcategories/{subcategoryId}")
    public ResponseEntity<CategoryResponse> addSubcategoryToCategory(
            @PathVariable Long categoryId,
            @PathVariable Long subcategoryId
    ) {
        Category category = categoryService.addSubcategoryToCategory(categoryId, subcategoryId);
        return ResponseEntity.ok(CategoryResponse.from(category));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @DeleteMapping("/{categoryId}/subcategories/{subcategoryId}")
    public ResponseEntity<CategoryResponse> removeSubcategoryFromCategory(
            @PathVariable Long categoryId,
            @PathVariable Long subcategoryId
    ) {
        Category category = categoryService.removeSubcategoryFromCategory(categoryId, subcategoryId);
        return ResponseEntity.ok(CategoryResponse.from(category));
    }
}
