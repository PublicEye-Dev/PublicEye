package com.appbackend.backend.dto;

import jakarta.validation.constraints.*;
import org.springframework.web.multipart.MultipartFile;

public record ComplaintCreateRequest(
        @NotBlank(message = "Descrierea este obligatorie")
        String description,

        @NotNull(message = "Categoria este obligatorie")
        Long categoryId,

        @NotNull(message = "Subcategoria este obligatorie")
        Long subcategoryId,

        @NotNull(message = "Utilizatorul este obligatoriu")
        Long userId,

        Double latitude,
        Double longitude
) {}