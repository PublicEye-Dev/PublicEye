package com.appbackend.backend.dto;

import com.appbackend.backend.enums.Role;

public record AuthResponse(
        String token,
        Role role
) {}