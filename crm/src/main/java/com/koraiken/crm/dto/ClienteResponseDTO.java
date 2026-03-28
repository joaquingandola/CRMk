package com.koraiken.crm.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ClienteResponseDTO {
    private Long idCliente;
    private String nombre;
    private String apellido;
    private Integer dni;
    private LocalDate fechaNacimiento;
    private LocalDateTime fechaCreacion;
    private Boolean activo;
    private Boolean enViaje;
    private List<ContactoDTO> contactos;
}
