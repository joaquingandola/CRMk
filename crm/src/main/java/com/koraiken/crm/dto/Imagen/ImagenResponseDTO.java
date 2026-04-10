package com.koraiken.crm.dto.Imagen;

import com.koraiken.crm.model.TipoDocumento;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ImagenResponseDTO {

    private Long idImagen;
    private String url;
    private String alt;
    private TipoDocumento tipoDocumento;
}
