package com.appbackend.backend.dto.gemini;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GeminiResponseDto(List<GeminiCandidateDto> candidates) {
}

