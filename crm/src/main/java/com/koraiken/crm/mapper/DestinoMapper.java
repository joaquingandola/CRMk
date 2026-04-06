package com.koraiken.crm.mapper;

import com.koraiken.crm.dto.CiudadResponseDTO;
import com.koraiken.crm.dto.DestinoEnViajeDTO;
import com.koraiken.crm.dto.DestinoResponseDTO;
import com.koraiken.crm.model.Ciudad;
import com.koraiken.crm.model.Destino;

public class DestinoMapper {

    public static DestinoResponseDTO toDTO(Destino destino) {
        return DestinoResponseDTO.builder()
                .idDestino(destino.getIdDestino())
                .ciudad(toCiudadDTO(destino.getCiudad()))
                .fechaLlegada(destino.getFechaLlegada())
                .fechaSalida(destino.getFechaSalida())
                .idViaje(destino.getViaje().getIdViaje())
                .build();
    }

    public static DestinoEnViajeDTO toEnViajeDTO(Destino destino) {
        return DestinoEnViajeDTO.builder()
                .idDestino(destino.getIdDestino())
                .ciudad(toCiudadDTO(destino.getCiudad()))
                .fechaLlegada(destino.getFechaLlegada())
                .fechaSalida(destino.getFechaSalida())
                .build();
    }
    public static CiudadResponseDTO toCiudadDTO(Ciudad ciudad) {
        return CiudadResponseDTO.builder()
                .idCiudad(ciudad.getIdCiudad())
                .nombre(ciudad.getNombre())
                .pais(ciudad.getPais().getNombre())
                .latitud(ciudad.getLatitud())
                .longitud(ciudad.getLongitud())
                .build();
    }
}
