package com.koraiken.crm.dto.Cliente;

import com.koraiken.crm.dto.Contacto.ContactoInputDTO;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class ClienteCreateDTO {

    private String nombre;
    private String apellido;
    private Integer dni;
    private LocalDate fechaNacimiento;
    private List<ContactoInputDTO> contactos;
}

