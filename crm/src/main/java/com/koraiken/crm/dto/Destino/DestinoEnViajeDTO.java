package com.koraiken.crm.dto.Destino;

import com.koraiken.crm.dto.Ciudad.CiudadResponseDTO;
import com.koraiken.crm.dto.Hotel.HotelResponseDTO;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class DestinoEnViajeDTO {
    private Long idDestino;
    private CiudadResponseDTO ciudad;
    private LocalDate fechaLlegada;
    private LocalDate fechaSalida;
    private HotelResponseDTO hotel;
}
