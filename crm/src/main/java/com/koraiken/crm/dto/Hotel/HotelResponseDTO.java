package com.koraiken.crm.dto.Hotel;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class HotelResponseDTO {
    private Long idHotel;
    private String direccion;
    private String nombre;
}
