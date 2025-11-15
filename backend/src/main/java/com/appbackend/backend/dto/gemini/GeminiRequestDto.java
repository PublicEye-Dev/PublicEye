package com.appbackend.backend.dto.gemini;

import java.util.List;

public record GeminiRequestDto(List<GeminiContentDto> contents) {
}

