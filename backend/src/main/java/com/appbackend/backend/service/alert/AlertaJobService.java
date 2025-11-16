package com.appbackend.backend.service.alert;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appbackend.backend.dto.AlertaDto;
import com.appbackend.backend.dto.ComplaintDto;
import com.appbackend.backend.entity.Alerta;
import com.appbackend.backend.repository.AlertaRepository;
import com.appbackend.backend.repository.ComplaintRepository;
import com.appbackend.backend.service.ai.GeminiAnalysisService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AlertaJobService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AlertaJobService.class);
    private static final int MINUTES_TO_CHECK = 30;

    private final ComplaintRepository complaintRepository;
    private final GeminiAnalysisService geminiAnalysisService;
    private final AlertaRepository alertaRepository;

    @Scheduled(fixedRate = 1800000) // Rulează la fiecare 30 de minute (1800000 ms)
    @Transactional
    public void proceseazaAlerteNoi() {
        LOGGER.info("Început procesare alerte noi - job scheduled");

        try {
            LocalDateTime threshold = LocalDateTime.now().minusMinutes(MINUTES_TO_CHECK);
            List<ComplaintDto> sesizariNoi = complaintRepository
                    .findAll()
                    .stream()
                    .filter(c -> c.getCreatedAt().isAfter(threshold))
                    .map(ComplaintDto::from)
                    .collect(Collectors.toList());

            if (sesizariNoi.isEmpty()) {
                LOGGER.info("Nu există sesizări noi în ultimele {} minute", MINUTES_TO_CHECK);
                return;
            }

            LOGGER.info("Găsite {} sesizări noi pentru analiză", sesizariNoi.size());

            List<AlertaDto> alerteGenerate = geminiAnalysisService.analizeazaSesizari(sesizariNoi);

            if (alerteGenerate.isEmpty()) {
                LOGGER.info("Nu s-au generat alerte noi");
                return;
            }

            LOGGER.info("Generate {} alerte noi de la AI", alerteGenerate.size());

            for (AlertaDto alertaDto : alerteGenerate) {
                if (alertaDto.latitude() == null || alertaDto.longitude() == null) {
                    LOGGER.warn("Alertă ignorată - lipsește latitudine sau longitudine: {}", alertaDto);
                    continue;
                }

                Alerta alerta = new Alerta();
                alerta.setTipPericol(alertaDto.tipPericol());
                alerta.setDescriere(alertaDto.descriereAlerta());
                alerta.setZona(alertaDto.zona());
                alerta.setLatitude(alertaDto.latitude());
                alerta.setLongitude(alertaDto.longitude());

                alertaRepository.save(alerta);
                LOGGER.debug("Salvată alertă: {} - {}", alerta.getTipPericol(), alerta.getZona());
            }

            LOGGER.info("Finalizat procesare alerte - {} alerte salvate", alerteGenerate.size());

        } catch (Exception e) {
            LOGGER.error("Eroare la procesarea alertelor în job scheduled", e);
        }
    }
}

