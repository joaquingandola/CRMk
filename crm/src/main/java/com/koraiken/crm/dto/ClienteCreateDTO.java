package com.koraiken.crm.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class ClienteCreateDTO {

    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private List<ContactoInputDTO> contactos;
}

