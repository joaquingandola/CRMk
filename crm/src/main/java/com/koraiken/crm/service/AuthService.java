package com.koraiken.crm.service;

import com.koraiken.crm.dto.AuthResponse;
import com.koraiken.crm.dto.LoginRequest;
import com.koraiken.crm.dto.RegisterRequest;
import com.koraiken.crm.model.TipoRol;
import com.koraiken.crm.model.Usuario;
import com.koraiken.crm.repository.IUsuarioRepository;
import com.koraiken.crm.security.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
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
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        Usuario usuario = iUsuarioRepository.findByEmail(request.getEmail())
                .orElseThrow();

        String token = jwtService.generateToken(usuario);
        return new AuthResponse(token); //aca esta la diferencia de parametros, capaz podriamos tener un refresh token
    }

    public AuthResponse register(RegisterRequest request) {
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
