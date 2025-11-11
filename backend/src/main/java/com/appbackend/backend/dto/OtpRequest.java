package com.appbackend.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record OtpRequest(
        @NotBlank String identifier
) {}