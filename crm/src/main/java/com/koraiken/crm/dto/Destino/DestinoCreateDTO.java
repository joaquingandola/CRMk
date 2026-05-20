package com.koraiken.crm.dto.Destino;

import com.koraiken.crm.dto.Hotel.HotelCreateDTO;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class DestinoCreateDTO {
    private Long idCiudad;
    private Long idViaje;
    private Long idHotel;
    private HotelCreateDTO hotel;
    private LocalDate fechaLlegada;
    private LocalDate fechaSalida;
}
