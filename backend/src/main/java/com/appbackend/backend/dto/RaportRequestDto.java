package com.appbackend.backend.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public record RaportRequestDto(
        @NotNull(message = "Data de început este obligatorie")
        LocalDate dataInceput,
        @NotNull(message = "Data de sfârșit este obligatorie")
        LocalDate dataSfarsit
) {
}

