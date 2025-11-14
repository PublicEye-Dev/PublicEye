package com.appbackend.backend.controller;

import com.appbackend.backend.dto.*;
import com.appbackend.backend.entity.Category;
import com.appbackend.backend.entity.Department;
import com.appbackend.backend.entity.Subcategory;
import com.appbackend.backend.entity.User;
import com.appbackend.backend.service.admin.AdminService;
import com.appbackend.backend.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping ("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")

public class AdminController {

    private final AdminService adminService;
    private final UserService userService;


    @PostMapping("/departments")
    public ResponseEntity<DepartmentResponse> createDepartment(
            @Valid @RequestBody DepartmentCreateRequest request) {
        Department department = adminService.createDepartment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(DepartmentResponse.from(department));
    }


    @PostMapping("/subcategories")
    public ResponseEntity<SubcategoryResponse> createSubcategory(
            @Valid @RequestBody SubcategoryCreateRequest request) {
        Subcategory subcategory = adminService.createSubcategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(SubcategoryResponse.from(subcategory));
    }

    @PostMapping("/operators")
    public ResponseEntity<UserDto> createOperator(
            @Valid @RequestBody DepartmentOperatorCreateRequest request) {
        User operator = adminService.createDepartmentOperator(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(UserDto.from(operator));
    }

    @GetMapping("/get-users")
    public ResponseEntity<List<UserDto>> getUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
