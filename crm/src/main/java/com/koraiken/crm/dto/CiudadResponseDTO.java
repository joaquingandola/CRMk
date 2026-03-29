package com.koraiken.crm.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CiudadResponseDTO {
    private Long idCiudad;
    private String nombre;
    private String pais;
    private Double latitud; //mapa
    private Double longitud;
}
