package com.appbackend.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordChangeRequest(
        @NotBlank(message = "Parola veche este obligatorie")
        String oldPassword,
        @NotBlank(message = "Parola nouă este obligatorie")
        @Size(min = 8, message = "Parola nouă trebuie să conțină cel puțin 8 caractere")
        String newPassword
) {}

