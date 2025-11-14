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

import com.appbackend.backend.dto.PagedResponse;
import com.appbackend.backend.dto.SubcategoryCreateRequest;
import com.appbackend.backend.dto.SubcategoryResponse;
import com.appbackend.backend.entity.Subcategory;
import com.appbackend.backend.service.subcategory.SubcategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/subcategories")
@RequiredArgsConstructor

public class SubcategoryController {
    private final SubcategoryService subcategoryService;

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @GetMapping
    public ResponseEntity<PagedResponse<SubcategoryResponse>> getAllSubcategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long categoryId
    ) {
        PagedResponse<SubcategoryResponse> response = subcategoryService.getAllSubcategories(page, size, categoryId);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'USER')")
    @GetMapping("/{id}")
    public ResponseEntity<SubcategoryResponse> getSubcategoryById(@PathVariable Long id) {
        Subcategory subcategory = subcategoryService.getSubcategoryById(id);
        return ResponseEntity.ok(SubcategoryResponse.from(subcategory));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @PostMapping
    public ResponseEntity<SubcategoryResponse> createSubcategory(
            @Valid @RequestBody SubcategoryCreateRequest request
    ) {
        Subcategory subcategory = subcategoryService.addSubcategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(SubcategoryResponse.from(subcategory));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @PutMapping("/update/{id}")
    public ResponseEntity<SubcategoryResponse> updateSubcategory(
            @PathVariable Long id,
            @Valid @RequestBody SubcategoryCreateRequest request
    ) {
        Subcategory updated = subcategoryService.updateSubcategory(id, request);
        return ResponseEntity.ok(SubcategoryResponse.from(updated));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSubcategory(@PathVariable Long id) {
        subcategoryService.deleteSubcategory(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'USER')")
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<SubcategoryResponse>> getSubcategoriesByCategory(@PathVariable Long categoryId) {
        List<SubcategoryResponse> responses = subcategoryService.getSubcategoriesByCategoryId(categoryId)
                .stream()
                .map(SubcategoryResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
}
