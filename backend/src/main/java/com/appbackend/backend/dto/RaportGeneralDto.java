package com.appbackend.backend.dto;

import java.util.List;

public record RaportGeneralDto(
        SumarExecutivDto sumarExecutiv,
        List<TopProblemaDto> topProbleme,
        List<ZonaFierbinteDto> zoneFierbinti
) {
}

