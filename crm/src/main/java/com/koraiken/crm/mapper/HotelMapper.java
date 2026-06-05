package com.koraiken.crm.mapper;

import com.koraiken.crm.dto.Hotel.HotelResponseDTO;
import com.koraiken.crm.model.Hotel;

public class HotelMapper {
    public static HotelResponseDTO toDTO(Hotel hotel) {
        return HotelResponseDTO.builder()
                .idHotel(hotel.getIdHotel())
                .nombre(hotel.getNombre())
                .direccion(hotel.getDireccion())
                .idDestino(hotel.getIdHotel())
                .build();
    }
}
