package com.koraiken.crm.dto.Cliente;

import com.koraiken.crm.dto.Contacto.ContactoInputDTO;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class ClienteUpdateDTO {
    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private List<ContactoInputDTO> contactos;
}
