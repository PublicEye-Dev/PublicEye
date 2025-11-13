package com.appbackend.backend.controller;

import com.appbackend.backend.dto.CategoryResponse;
import com.appbackend.backend.dto.DepartmentCreateRequest;
import com.appbackend.backend.dto.DepartmentResponse;
import com.appbackend.backend.entity.Category;
import com.appbackend.backend.entity.Department;
import com.appbackend.backend.service.department.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {
        List<Department> departments = departmentService.getAllDepartment();
        List<DepartmentResponse> responses = departments.stream()
                .map(DepartmentResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @GetMapping("/{id}")
    public ResponseEntity<DepartmentResponse> getDepartmentById(@PathVariable Long id) {
        Department department = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(DepartmentResponse.from(department));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("update/{departmentId}/categories")
    public ResponseEntity<DepartmentResponse> updateCategories(
            @PathVariable Long departmentId,
            @RequestParam Long exCategoryId,
            @RequestParam Long newCategoryId) {
        Department updatedDepartment = departmentService.updateCategories(
                departmentId,
                exCategoryId,
                newCategoryId
        );
        return ResponseEntity.ok(DepartmentResponse.from(updatedDepartment));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @PutMapping("/update-department")
    public ResponseEntity<DepartmentResponse> updateDepartment(DepartmentCreateRequest departmentDto){
        Department updatedDepartment = departmentService.updateDepartment(departmentDto);
        return ResponseEntity.ok(DepartmentResponse.from(updatedDepartment));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @GetMapping("/get-department-categories/{id}")
    public ResponseEntity<List<CategoryResponse>> getDepartmentCategories(@PathVariable(name = "id") Long id) {
        List<Category> categories = departmentService.getAllCategoriesOfDepartment(id);
        List<CategoryResponse> categoriesResponseList = categories.stream()
                .map(CategoryResponse::from)
                .toList();
        return ResponseEntity.ok(categoriesResponseList);
    }
}