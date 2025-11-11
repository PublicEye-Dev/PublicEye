package com.appbackend.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DepartmentOperatorCreateRequest(
        @NotBlank(message = "Numele complet este obligatoriu")
        String fullName,
        @NotBlank(message = "Email-ul este obligatoriu")
        @Email(message = "Email invalid")
        String email,
        @NotBlank(message = "Parola este obligatorie")
        @Size(min = 8, message = "Parola trebuie să conțină cel puțin 8 caractere")
        String password,
        @NotNull(message = "Departamentul este obligatoriu")
        Long departmentId
) {}