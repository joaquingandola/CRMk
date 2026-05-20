package com.koraiken.crm.dto.Viaje;

import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class ViajeUpdateDTO {

    private Long idAerolinea;
    private LocalDate fechaInicioViaje;
    private LocalDate fechaFinViaje;
    private Double precio;
}
