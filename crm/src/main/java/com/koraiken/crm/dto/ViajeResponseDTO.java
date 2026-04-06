package com.koraiken.crm.dto;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public class ViajeResponseDTO {
    private Long idViaje;
    private LocalDateTime fechaSalida;
    private LocalDateTime fechaLlegada;
    private LocalDateTime fechaCreacion;
    private Double precio;
    private Boolean activo;

    private long idCliente;
    private String nombreCliente;

    private AerolineaResponseDTO aerolinea;
    private EstadoViajeResponseDTO estadoActual;
    private List<DestinoResponseDTO> destinos;
    private List<AcompananteResponseDTO> acompanantes;
}
