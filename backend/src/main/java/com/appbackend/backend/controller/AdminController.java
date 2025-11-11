package com.appbackend.backend.controller;

import com.appbackend.backend.dto.*;
import com.appbackend.backend.entity.Category;
import com.appbackend.backend.entity.Department;
import com.appbackend.backend.entity.User;
import com.appbackend.backend.service.admin.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping ("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")

public class AdminController {

    private final AdminService adminService;

    @PostMapping("/departments")
    public ResponseEntity<DepartmentResponse> createDepartment(
            @Valid @RequestBody DepartmentCreateRequest request) {
        Department department = adminService.createDepartment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(DepartmentResponse.from(department));
    }

    @PostMapping("/categories")
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryCreateRequest request) {
        Category category = adminService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CategoryResponse.from(category));
    }

    @PostMapping("/operators")
    public ResponseEntity<UserResponse> createOperator(
            @Valid @RequestBody DepartmentOperatorCreateRequest request) {
        User operator = adminService.createDepartmentOperator(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(UserResponse.from(operator));
    }
}
