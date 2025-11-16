package com.appbackend.backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appbackend.backend.dto.AlertaResponseDto;
import com.appbackend.backend.entity.Alerta;
import com.appbackend.backend.repository.AlertaRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final AlertaRepository alertaRepository;

    @GetMapping("/alerte")
    public ResponseEntity<List<AlertaResponseDto>> getAlerteActive() {
        // Returnează alertele din ultimele 48 de ore
        LocalDateTime since = LocalDateTime.now().minusHours(48);
        List<Alerta> alerte = alertaRepository.findRecentAlerts(since);

        List<AlertaResponseDto> response = alerte.stream()
                .map(alerta -> new AlertaResponseDto(
                        alerta.getId(),
                        alerta.getTipPericol(),
                        alerta.getZona(),
                        alerta.getDescriere(),
                        alerta.getLatitude(),
                        alerta.getLongitude(),
                        alerta.getCreatedAt().toString()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}

