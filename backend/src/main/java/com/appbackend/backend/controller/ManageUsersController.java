package com.appbackend.backend.controller;

import com.appbackend.backend.dto.DepartmentResponse;
import com.appbackend.backend.service.admin.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.appbackend.backend.dto.PagedResponse;
import com.appbackend.backend.dto.UserDto;
import com.appbackend.backend.enums.Role;
import com.appbackend.backend.service.user.UserService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/manage-users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class ManageUsersController {

    private final UserService userService;
    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<PagedResponse<UserDto>> getUsers(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "role", required = false) Role role,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortDir", defaultValue = "ASC") String sortDir) {

        PagedResponse<UserDto> response = userService.getUsersForManagement(name, role, page, size, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/search")
    public ResponseEntity<PagedResponse<UserDto>> searchUsers(
            @RequestParam(name = "keyword") String keyword,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortDir", defaultValue = "ASC") String sortDir) {

        PagedResponse<UserDto> response = userService.searchUsers(keyword, page, size, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/departments-without-operator")
    public ResponseEntity<List<DepartmentResponse>> getDepartmentsWithoutOperator(){
        return ResponseEntity.ok(adminService.getDepartmentsWithoutOperator());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable(name = "id") Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
