package com.koraiken.crm.dto.Ciudad;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CiudadVisitadaDTO {
    private Long idCiudad;
    private String nombre;
    private String pais;
    private Long cantidadVisitas;
}
