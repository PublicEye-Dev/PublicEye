package com.appbackend.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appbackend.backend.dto.DepartmentCreateRequest;
import com.appbackend.backend.dto.DepartmentOperatorCreateRequest;
import com.appbackend.backend.dto.DepartmentResponse;
import com.appbackend.backend.dto.UserDto;
import com.appbackend.backend.entity.Department;
import com.appbackend.backend.entity.User;
import com.appbackend.backend.service.admin.AdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

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

    @PostMapping("/operators")
    public ResponseEntity<UserDto> createOperator(
            @Valid @RequestBody DepartmentOperatorCreateRequest request) {
        User operator = adminService.createDepartmentOperator(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(UserDto.from(operator));
    }

    @GetMapping("/departments/{departmentId}/operator")
    public ResponseEntity<UserDto> getDepartmentOperator(
            @PathVariable Long departmentId) {
        UserDto operator = adminService.getDepartmentOperator(departmentId);
        return ResponseEntity.ok(operator);
    }

}
