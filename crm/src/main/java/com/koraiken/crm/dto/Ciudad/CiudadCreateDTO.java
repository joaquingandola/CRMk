package com.koraiken.crm.dto.Ciudad;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CiudadCreateDTO {
    private String nombre;
    private Long idPais;
    private Double latitud;
    private Double longitud;
}
