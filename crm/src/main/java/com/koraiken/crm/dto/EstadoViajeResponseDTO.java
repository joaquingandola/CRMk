package com.koraiken.crm.dto;

import com.koraiken.crm.model.EstadoConcretoViaje;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class EstadoViajeResponseDTO {

    private Long idEstadoViaje;
    private EstadoConcretoViaje estadoConcretoViaje;
    private LocalDateTime fechaActualizacion;
}
