package com.koraiken.crm.dto.Hotel;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class HotelVisitadoDTO {
    Long idHotel;
    String nombre;
    String direccion;
    Double cantidadVisitas;
}
