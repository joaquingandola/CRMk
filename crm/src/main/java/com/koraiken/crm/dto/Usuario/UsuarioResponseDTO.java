package com.koraiken.crm.dto.Usuario;

import com.koraiken.crm.model.TipoRol;
import lombok.Builder;
import lombok.Getter;


@Getter
@Builder
public class UsuarioResponseDTO {
    private Long idUsuario;
    private String username;
    private String email;
    private TipoRol tipoRol;
    private boolean activo;
}
