package com.koraiken.crm.mapper;

import com.koraiken.crm.dto.Cliente.ClienteResponseDTO;
import com.koraiken.crm.dto.Contacto.ContactoDTO;
import com.koraiken.crm.dto.Observacion.ObservacionResponseDTO;
import com.koraiken.crm.model.Cliente;
import com.koraiken.crm.model.Contacto;
import com.koraiken.crm.model.Observacion;

import java.util.List;

public class ClienteMapper {

    public static ClienteResponseDTO toDTO(Cliente cliente) {
        List<ContactoDTO> contactosDTO = cliente.getContacto()
                .stream()
                .map(ClienteMapper::toContactoDTO)
                .toList();

        List<ObservacionResponseDTO> observacionesDTO = cliente.getObservaciones()
                .stream()
                .map(ClienteMapper::toObservacionDTO)
                .toList();

        return ClienteResponseDTO.builder()
                .idCliente(cliente.getIdCliente())
                .nombre(cliente.getNombre())
                .apellido(cliente.getApellido())
                .dni(cliente.getDni())
                .fechaNacimiento(cliente.getFechaNacimiento())
                .fechaCreacion(cliente.getFechaAlta())
                .activo(cliente.getActivo())
                .contactos(contactosDTO)
                .idAgente(cliente.getAgente() != null ? cliente.getAgente().getIdUsuario() : null)
                .nombreAgente(cliente.getAgente() != null ? cliente.getAgente().getNombreUsuario() : null)
                .observaciones(observacionesDTO)
                .build();
    }

    private static ContactoDTO toContactoDTO(Contacto contacto) {
        return ContactoDTO.builder()
                .idContacto(contacto.getIdContacto())
                .detalle(contacto.getDetalle())
                .medio(contacto.getMedio())
                .build();
    }

    private static ObservacionResponseDTO toObservacionDTO(Observacion obs) {
        return ObservacionResponseDTO.builder()
                .idObservacion(obs.getIdObservacion())
                .idCliente(obs.getCliente().getIdCliente())
                .observacion(obs.getObservacion())
                .fechaCreacion(obs.getFechaCreacion())
                .build();
    }
}
