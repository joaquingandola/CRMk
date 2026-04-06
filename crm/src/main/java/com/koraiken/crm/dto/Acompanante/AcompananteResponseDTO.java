package com.koraiken.crm.dto.Acompanante;

import lombok.Builder;
import lombok.Getter;

import java.util.Date;


@Getter
@Builder
public class AcompananteResponseDTO {
    private Long idAcompanante;
    private String nombre;
    private String apellido;
    private Integer dni;
    private Date fechaNacimiento;
}
