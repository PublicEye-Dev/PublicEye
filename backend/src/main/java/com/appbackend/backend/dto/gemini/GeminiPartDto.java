package com.appbackend.backend.dto.gemini;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GeminiPartDto(String text) {
}

