package com.appbackend.backend.service.ai;

import java.util.List;

import com.appbackend.backend.dto.AlertaDto;
import com.appbackend.backend.dto.ComplaintDto;

public interface GeminiAnalysisService {

    List<AlertaDto> analizeazaSesizari(List<ComplaintDto> sesizari);
}

