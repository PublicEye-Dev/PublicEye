package com.appbackend.backend.dto;

import com.appbackend.backend.entity.User;
import com.appbackend.backend.enums.Role;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        Role role,
        Long departmentId
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getDepartment() != null ? user.getDepartment().getId() : null
        );
    }
}