package com.koraiken.crm.dto.Contacto;

import com.koraiken.crm.model.Medio;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactoInputDTO {

    private String detalle;
    private Medio medio;
}
