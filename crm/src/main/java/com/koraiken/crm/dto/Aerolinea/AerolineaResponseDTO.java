package com.koraiken.crm.dto.Aerolinea;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AerolineaResponseDTO {
    private Long idAerolinea;
    private String aerolinea;
}
