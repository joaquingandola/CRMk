package com.koraiken.crm.service;


import com.koraiken.crm.exception.UserMailNotFoundException;
import com.koraiken.crm.model.Usuario;
import com.koraiken.crm.repository.IUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthContextService {
    private final IUsuarioRepository usuarioRepository;

    public Usuario obtenerUsuarioAuth() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UserMailNotFoundException(email));
    }

}
