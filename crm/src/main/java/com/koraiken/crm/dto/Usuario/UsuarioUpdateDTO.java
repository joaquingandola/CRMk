package com.koraiken.crm.dto.Usuario;

import com.koraiken.crm.model.TipoRol;
import lombok.Getter;

@Getter
public class UsuarioUpdateDTO {
    private String username;
    private TipoRol tipoRol;
}
