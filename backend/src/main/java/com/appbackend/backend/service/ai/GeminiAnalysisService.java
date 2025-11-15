package com.appbackend.backend.service.ai;

import java.util.List;

import com.appbackend.backend.dto.AlertaDto;
import com.appbackend.backend.dto.ComplaintDto;
import com.appbackend.backend.dto.RaportGeneralDto;

public interface GeminiAnalysisService {

    List<AlertaDto> analizeazaSesizari(List<ComplaintDto> sesizari);
    RaportGeneralDto genereazaRaportAgregat(List<ComplaintDto> sesizari);
}

