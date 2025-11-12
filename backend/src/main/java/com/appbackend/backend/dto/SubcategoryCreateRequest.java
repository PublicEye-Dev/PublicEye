package com.appbackend.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SubcategoryCreateRequest(
        @NotBlank(message = "Numele subcategoriei este obligatoriu")
        String name,
        @NotNull(message = "Id-ul categoriei este obligatoriu")
        Long categoryId
) {
}
