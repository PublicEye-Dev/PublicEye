package com.appbackend.backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record CategoryCreateRequest(
        Long departmentId,
        @NotBlank(message = "Numele categoriei este obligatoriu")
        String name
) {}