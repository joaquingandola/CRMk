package com.koraiken.crm.dto.Viaje;

import com.koraiken.crm.dto.Acompanante.AcompananteResponseDTO;
import com.koraiken.crm.dto.Aerolinea.AerolineaResponseDTO;
import com.koraiken.crm.dto.Destino.DestinoEnViajeDTO;
import com.koraiken.crm.dto.EstadoViaje.EstadoViajeResponseDTO;
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
    private String nombreCliente; // nombre + apellido para mostrar en pantalla

    private AerolineaResponseDTO aerolinea;
    private EstadoViajeResponseDTO estadoActual;
    private List<DestinoEnViajeDTO> destinos;
    private List<AcompananteResponseDTO> acompanantes;
}
