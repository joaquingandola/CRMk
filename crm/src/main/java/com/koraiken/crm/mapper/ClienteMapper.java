package com.koraiken.crm.mapper;

import com.koraiken.crm.dto.ClienteResponseDTO;
import com.koraiken.crm.dto.ContactoDTO;
import com.koraiken.crm.model.Cliente;
import com.koraiken.crm.model.Contacto;

import java.util.List;

public class ClienteMapper {

    public static ClienteResponseDTO toDTO(Cliente cliente) {
        List<ContactoDTO> contactosDTO = cliente.getContacto()
                .stream()
                .map(ClienteMapper::toContactoDTO)
                .toList();

        return ClienteResponseDTO.builder()
                .idCliente(cliente.getIdCliente())
                .nombre(cliente.getNombre())
                .apellido(cliente.getApellido())
                .dni(cliente.getDni())
                .fechaNacimiento(cliente.getFechaNacimiento())
                .fechaCreacion(cliente.getFechaAlta())
                .activo(cliente.getActivo())
                .enViaje(cliente.getEnViaje())
                .contactos(contactosDTO)
                .build();
    }

    private static ContactoDTO toContactoDTO(Contacto contacto) {
        return ContactoDTO.builder()
                .idContacto(contacto.getIdContacto())
                .detalle(contacto.getDetalle())
                .medio(contacto.getMedio())
                .build();
    }
}
