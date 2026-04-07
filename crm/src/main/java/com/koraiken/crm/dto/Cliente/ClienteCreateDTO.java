package com.koraiken.crm.dto.Cliente;

import com.koraiken.crm.dto.Contacto.ContactoInputDTO;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class ClienteCreateDTO {

    private String nombre;
    private String apellido;
    private Integer dni;
    private LocalDate fechaNacimiento;
    private List<ContactoInputDTO> contactos;
}

