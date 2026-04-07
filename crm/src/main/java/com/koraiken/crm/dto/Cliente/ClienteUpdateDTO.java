package com.koraiken.crm.dto.Cliente;

import com.koraiken.crm.dto.Contacto.ContactoInputDTO;
import lombok.*;

import java.time.LocalDate;
import java.util.List;


@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class ClienteUpdateDTO {
    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private List<ContactoInputDTO> contactos;
}
