package com.koraiken.crm.dto;


import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class ViajeCreateDTO {
    private Long idCliente;
    private Long idAerolinea;
    private LocalDateTime fechaSalida;
    private LocalDateTime fechaLlegada;
    private Double precio;

    private List<Long> idAcompanantes;
    private List<DestinoCreateDTO> destinos;
}
