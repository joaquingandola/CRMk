package com.koraiken.crm.dto.Destino;

import com.koraiken.crm.dto.Ciudad.CiudadResponseDTO;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class DestinoResponseDTO {
    private Long idDestino;
    private CiudadResponseDTO ciudad;
    private LocalDate fechaLlegada;
    private LocalDate fechaSalida;
    private Long idViaje;
    private Long idHotel;
}
