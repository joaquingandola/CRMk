package com.koraiken.crm.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.cglib.core.Local;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Getter
@Setter
@Builder
@Entity
@Table(name = "Usuario")
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;
    private String username;
    private String email;
    private String password;
    private boolean activo = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_rol")
    private TipoRol tipoRol;

    public static Usuario con(String username, String email, String password, TipoRol rol){
        return Usuario
                .builder()
                .password(password)
                .username(username)
                .email(email)
                .tipoRol(rol)
                .build();
    }

    @Override
    public String getUsername() {return email;}

    @Override
    public String getPassword() {return password;}

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + tipoRol.name()));
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return activo; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return activo; }

}
