package com.koraiken.crm.dto.Destino;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class DestinoCreateDTO {
    private Long idCiudad;
    private Long idViaje;
    private LocalDateTime fechaLlegada;
    private LocalDateTime fechaSalida;
}
