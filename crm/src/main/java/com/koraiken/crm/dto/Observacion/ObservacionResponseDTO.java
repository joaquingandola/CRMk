package com.koraiken.crm.dto.Observacion;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ObservacionResponseDTO {
    private Long idObservacion;
    private Long idCliente;
    private String observacion;
    private LocalDateTime fechaCreacion;
}
