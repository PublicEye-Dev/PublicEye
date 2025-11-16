package com.appbackend.backend.dto;

public record AlertaResponseDto(
        Long id,
        String tipPericol,
        String zona,
        String descriere,
        Double latitude,
        Double longitude,
        String createdAt
) {
}

