package com.koraiken.crm.dto.Observacion;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class ObservacionResponseDTO {
    private Long idObservacion;
    private Long idCliente;
    private String observacion;
    private LocalDateTime fechaCreacion;
}
