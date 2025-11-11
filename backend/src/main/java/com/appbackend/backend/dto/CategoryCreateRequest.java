package com.appbackend.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryCreateRequest(
        Long departmentId,
        @NotBlank(message = "Numele categoriei este obligatoriu")
        String name
) {}