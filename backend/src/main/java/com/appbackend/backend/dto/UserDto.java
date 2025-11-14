package com.appbackend.backend.dto;

import com.appbackend.backend.entity.User;
import com.appbackend.backend.enums.Role;

public record UserDto(
        Long id,
        String fullName,
        String email,
        String phoneNumber,
        Role role,
        Long departmentId,
        String departmentName
) {
    public static UserDto from(User user) {
        return new UserDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole(),
                user.getDepartment() != null ? user.getDepartment().getId() : null,
                user.getDepartment() != null ? user.getDepartment().getName() : null
        );
    }
}