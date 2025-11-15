package com.appbackend.backend.dto;

import java.util.List;

public record AlertaDto(
        String tipPericol,
        String zona,
        String descriereAlerta,
        List<Long> idSesizariAsociate
) {
}

