package com.appbackend.backend.dto;

import com.appbackend.backend.enums.PetitionStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PetitionUpdateRequest(
        @NotNull(message = "Statusul este obligatoriu")
        PetitionStatus status,
        @NotBlank(message = "Motivul închiderii este obligatoriu")
        String officialResponse
) {
}

