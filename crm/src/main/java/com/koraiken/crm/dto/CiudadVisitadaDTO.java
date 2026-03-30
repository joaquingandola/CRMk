package com.koraiken.crm.dto;

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
