package com.koraiken.crm.dto.Acompanante;

import lombok.Getter;

import java.util.Date;

@Getter
public class AcompananteCreateDTO {
    private String nombre;
    private String apellido;
    private Integer dni;
    private Date fechaNacimiento;
}
