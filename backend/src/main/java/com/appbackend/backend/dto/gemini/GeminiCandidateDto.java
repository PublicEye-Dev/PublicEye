package com.appbackend.backend.dto.gemini;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GeminiCandidateDto(GeminiContentDto content) {
}

