package com.koraiken.crm.dto.Viaje;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ViajeUpdateDTO {

    private Long idAerolinea;
    private LocalDateTime fechaInicioViaje;
    private LocalDateTime fechaFinViaje;
    private Double precio;
}
