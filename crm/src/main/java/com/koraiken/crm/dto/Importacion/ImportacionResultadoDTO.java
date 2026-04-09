package com.koraiken.crm.dto.Importacion;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ImportacionResultadoDTO {
    private int importadas;
    private int errores;
    private String mensaje;
}
