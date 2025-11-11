package com.appbackend.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AdministrationLoginRequest(
        @Email @NotBlank String email,
        @NotBlank String password
) {}