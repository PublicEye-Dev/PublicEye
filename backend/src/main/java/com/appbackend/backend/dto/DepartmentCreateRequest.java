package com.appbackend.backend.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DepartmentCreateRequest(
        @NotBlank(message = "Numele departamentului este obligatoriu")
        String name,
        @Size(max = 500, message = "Descrierea poate avea cel mult 500 de caractere")
        String description,
        List<@NotBlank(message = "Numele categoriei nu poate fi gol") String> categories
) {}