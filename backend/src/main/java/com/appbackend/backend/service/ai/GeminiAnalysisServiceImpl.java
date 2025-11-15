package com.appbackend.backend.service.ai;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.appbackend.backend.dto.AlertaDto;
import com.appbackend.backend.dto.ComplaintDto;
import com.appbackend.backend.dto.GeminiAlertResponseDto;
import com.appbackend.backend.dto.gemini.GeminiContentDto;
import com.appbackend.backend.dto.gemini.GeminiPartDto;
import com.appbackend.backend.dto.gemini.GeminiRequestDto;
import com.appbackend.backend.dto.gemini.GeminiResponseDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class GeminiAnalysisServiceImpl implements GeminiAnalysisService {

    private static final Logger LOGGER = LoggerFactory.getLogger(GeminiAnalysisServiceImpl.class);
    private static final String RESPONSE_SCHEMA = """
            Returnează JSON cu structura exactă:
            {
              "alerte": [
                {
                  "tipPericol": "string - tipul pericolului identificat",
                  "zona": "string - zona sau adresa relevantă",
                  "descriereAlerta": "string - rezumatul riscului",
                  "idSesizariAsociate": [lista de ID-uri long]
                }
              ]
            }
            """;

    private final WebClient geminiWebClient;
    private final ObjectMapper objectMapper;

    @Override
    public List<AlertaDto> analizeazaSesizari(List<ComplaintDto> sesizari) {
        if (sesizari == null || sesizari.isEmpty()) {
            return List.of();
        }

        String serializedComplaints = serializeComplaints(sesizari);
        String prompt = buildPrompt(serializedComplaints);

        GeminiRequestDto request = new GeminiRequestDto(
                List.of(new GeminiContentDto(List.of(new GeminiPartDto(prompt))))
        );

        GeminiResponseDto response = geminiWebClient.post()
                .bodyValue(request)
                .retrieve()
                .bodyToMono(GeminiResponseDto.class)
                .onErrorResume(throwable -> {
                    LOGGER.error("Eroare la apelul Gemini", throwable);
                    return Mono.error(new IllegalStateException("Nu s-a putut obține răspuns de la Gemini"));
                })
                .block();

        String jsonPayload = extractJsonFromResponse(response);

        GeminiAlertResponseDto aiResponse;
        try {
            aiResponse = objectMapper.readValue(jsonPayload, GeminiAlertResponseDto.class);
        } catch (JsonProcessingException e) {
            LOGGER.error("Răspuns Gemini invalid: {}", jsonPayload, e);
            throw new IllegalStateException("Formatul răspunsului Gemini nu respectă schema așteptată", e);
        }

        return Optional.ofNullable(aiResponse.alerte()).orElse(List.of());
    }

    private String serializeComplaints(List<ComplaintDto> complaints) {
        try {
            return objectMapper.writeValueAsString(complaints);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Nu s-au putut serializa sesizările pentru analiză", e);
        }
    }

    private String buildPrompt(String complaintsJson) {
        return """
                Ești un agent AI al Primăriei Timișoara. Primești o listă de sesizări (probleme urbane).
                Identifică posibile pericole pentru siguranța publică: incendii, alunecări, inundații, infrastructură degradată etc.
                Corelează sesizările asemănătoare și marchează-le cu ID-urile lor.
                Dacă există cel puțin o sesizare, livrează măcar o alertă (chiar și cu severitate scăzută).
                Nu returna niciodată lista `alerte` goală; dacă nu identifici un pericol clar, setează `tipPericol` la "NECLAR" și explică de ce situația trebuie monitorizată.
                Răspunde numai în limba română.
                Nu folosi backticks, nu încadra JSON-ul în blocuri de cod și nu adăuga text suplimentar.
                %s
                Lista completă a sesizărilor (JSON):
                %s
                """.formatted(RESPONSE_SCHEMA, complaintsJson);
    }

    private String extractJsonFromResponse(GeminiResponseDto response) {
        if (response == null
                || response.candidates() == null
                || response.candidates().isEmpty()
                || response.candidates().get(0).content() == null
                || response.candidates().get(0).content().parts() == null
                || response.candidates().get(0).content().parts().isEmpty()
                || response.candidates().get(0).content().parts().get(0).text() == null) {
            throw new IllegalStateException("Gemini nu a întors niciun conținut util");
        }

        String raw = response.candidates().get(0).content().parts().get(0).text();
        return cleanupJson(raw);
    }

    private String cleanupJson(String raw) {
        if (raw == null) {
            throw new IllegalStateException("Gemini a trimis un răspuns gol");
        }

        String trimmed = raw.trim();
        if (trimmed.startsWith("```")) {
            int firstLineBreak = trimmed.indexOf('\n');
            int lastFence = trimmed.lastIndexOf("```");

            if (firstLineBreak > 0 && lastFence > firstLineBreak) {
                String withoutFence = trimmed.substring(firstLineBreak + 1, lastFence).trim();
                if (withoutFence.startsWith("json")) {
                    withoutFence = withoutFence.substring(4).trim();
                }
                return withoutFence;
            }
        }

        return trimmed;
    }
}

