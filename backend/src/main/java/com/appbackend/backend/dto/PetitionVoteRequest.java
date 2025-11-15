package com.appbackend.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record PetitionVoteRequest(
        @NotBlank(message = "Numele semnatarului este obligatoriu")
        String signerName
) {
}

