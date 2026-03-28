package com.koraiken.crm.dto;

import com.koraiken.crm.model.Medio;
import lombok.Builder;
import lombok.Getter;

@Getter
public class ContactoDTO {
    private Long idContacto;
    private Medio medio;
    private String detalle;
}
