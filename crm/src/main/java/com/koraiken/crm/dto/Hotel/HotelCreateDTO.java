package com.koraiken.crm.dto.Hotel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HotelCreateDTO {
    private Long idHotel;
    private String nombre;
    private String direccion;
}
