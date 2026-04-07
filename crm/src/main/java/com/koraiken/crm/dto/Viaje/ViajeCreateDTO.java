package com.koraiken.crm.dto.Viaje;


import com.koraiken.crm.dto.Destino.DestinoCreateDTO;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
public class ViajeCreateDTO {
    private Long idCliente;
    private Long idAerolinea;
    private LocalDateTime fechaInicioViaje;
    private LocalDateTime fechaFinViaje;
    private Double precio;

    private List<Long> idAcompanantes;
    private List<DestinoCreateDTO> destinos;
}
