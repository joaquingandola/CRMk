package com.koraiken.crm.service;

import com.koraiken.crm.model.Usuario;
import com.koraiken.crm.repository.IUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioDetailsService implements UserDetailsService {
    private final IUsuarioRepository iUsuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = iUsuarioRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("Usuario no encontrado: " + null));

        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getPassword())
                .roles(usuario.getTipoRol().name())
                .accountExpired(false)
                .accountLocked(!usuario.isActivo())
                .credentialsExpired(false)
                .disabled(!usuario.isActivo())
                .build();
    }

}
