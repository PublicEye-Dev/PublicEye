package com.appbackend.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record OtpVerifyRequest(
        @NotBlank String identifier,
        @NotBlank String otp
) {}