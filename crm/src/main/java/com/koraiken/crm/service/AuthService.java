package com.koraiken.crm.service;

import com.koraiken.crm.dto.Auth.AuthResponse;
import com.koraiken.crm.dto.Auth.LoginRequest;
import com.koraiken.crm.dto.Auth.RegisterRequest;
import com.koraiken.crm.exception.UserNotFoundException;
import com.koraiken.crm.model.TipoRol;
import com.koraiken.crm.model.Usuario;
import com.koraiken.crm.repository.IUsuarioRepository;
import com.koraiken.crm.security.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final IUsuarioRepository iUsuarioRepository;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Usuario o clave incorrectos");
        }

        Usuario usuario = iUsuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Usuario o clave incorrectos"));

        String token = jwtService.generateToken(usuario);
        return new AuthResponse(token);
    }

    public AuthResponse register(RegisterRequest request) {
        if(iUsuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email ya registrado");
        }

        if(iUsuarioRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Nombre de usuario ya registrado");
        }

        Usuario usuario = Usuario.con(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                TipoRol.AGENTE
        );

        iUsuarioRepository.save(usuario);

        String token = jwtService.generateToken(usuario);
        return new AuthResponse(token);
    }
}
