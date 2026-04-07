package com.koraiken.crm.mapper;

import com.koraiken.crm.dto.Acompanante.AcompananteResponseDTO;
import com.koraiken.crm.dto.Aerolinea.AerolineaResponseDTO;
import com.koraiken.crm.dto.Destino.DestinoEnViajeDTO;
import com.koraiken.crm.dto.EstadoViaje.EstadoViajeResponseDTO;
import com.koraiken.crm.dto.Viaje.ViajeResponseDTO;
import com.koraiken.crm.model.Acompanante;
import com.koraiken.crm.model.Aerolinea;
import com.koraiken.crm.model.EstadoViaje;
import com.koraiken.crm.model.Viaje;

import java.util.List;

public class ViajeMapper {

    public static ViajeResponseDTO toDTO(Viaje viaje, EstadoViaje estadoActual) {
        List<DestinoEnViajeDTO> destinos = viaje.getDestinos()
                .stream()
                .map(DestinoMapper::toEnViajeDTO)
                .toList();

        List<AcompananteResponseDTO> acompanantes = viaje.getAcompanantes()
                .stream()
                .map(ViajeMapper::toAcompananteDTO)
                .toList();

        return ViajeResponseDTO.builder()
                .idViaje(viaje.getIdViaje())
                .fechaFinViaje(viaje.getFechaFinViaje())
                .fechaInicioViaje(viaje.getFechaInicioViaje())
                .fechaCreacion(viaje.getFechaCreacion())
                .precio(viaje.getPrecio())
                .activo(viaje.getActivo())
                .idCliente(viaje.getCliente().getIdCliente())
                .nombreCliente(
                        viaje.getCliente().getNombre() + " " + viaje.getCliente().getApellido()
                )
                .aerolinea(toAerolineaDTO(viaje.getAerolinea()))
                .estadoActual(estadoActual != null ? toEstadoDTO(estadoActual) : null)
                .destinos(destinos)
                .acompanantes(acompanantes)
                .build();
    }

    private static EstadoViajeResponseDTO toEstadoDTO(EstadoViaje e) {
        return EstadoViajeResponseDTO.builder()
                .idEstadoViaje(e.getIdEstadoViaje())
                .estadoConcretoViaje(e.getEstadoConcretoViaje())
                .fechaActualizacion(e.getFechaActualizacion())
                .build();
    }

    private static AerolineaResponseDTO toAerolineaDTO(Aerolinea a) {
        if(a == null) return null;
        return AerolineaResponseDTO.builder()
                .idAerolinea(a.getIdAerolinea())
                .aerolinea(a.getAerolinea())
                .build();
    }

    private static AcompananteResponseDTO toAcompananteDTO(Acompanante acompanante) {
        return AcompananteResponseDTO.builder()
                .idAcompanante(acompanante.getIdAcompanante())
                .nombre(acompanante.getNombre())
                .apellido(acompanante.getApellido())
                .dni(acompanante.getDni())
                .fechaNacimiento(acompanante.getFechaNacimiento())
                .build();
    }
}
