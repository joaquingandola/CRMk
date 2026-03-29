package com.koraiken.crm.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class DestinoResponseDTO {
    private Long idDestino;
    private CiudadResponseDTO ciudad;
    private LocalDateTime fechaLlegada;
    private LocalDate fechaSalida;
    private Long idViaje;
}
