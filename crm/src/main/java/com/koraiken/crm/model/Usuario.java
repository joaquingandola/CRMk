package com.koraiken.crm.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.cglib.core.Local;
import java.util.List;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Getter
@Setter
@Builder
@Entity
@Table(name = "Usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_usuario;
    private String nombre;
    private String apellido;
    private String email;
    private String password;
    private boolean activo = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_rol")
    private TipoRol tipoRol;

    public static Usuario con(String nombre, String apellido, String email, String password, TipoRol rol){
        return Usuario
                .builder()
                .nombre(nombre)
                .password(password)
                .email(email)
                .apellido(apellido)
                .tipoRol(rol)
                .build();
    }
}
