package com.koraiken.crm.config;

import com.koraiken.crm.model.TipoRol;
import com.koraiken.crm.model.Usuario;
import com.koraiken.crm.repository.IUsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminUserInitializer implements CommandLineRunner {

    private static final String ADMIN_USERNAME = "admin";

    private final IUsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (usuarioRepository.existsByTipoRol(TipoRol.ADMIN)) {
            log.info("Ya existe un usuario ADMIN");
            return;
        }

        if (usuarioRepository.existsByEmail(adminEmail) || usuarioRepository.existsByUsername(ADMIN_USERNAME)) {
            log.warn("No se pudo crear el admin por defecto: el email '{}' o el username '{}' ya están en uso.",
                    adminEmail, ADMIN_USERNAME);
            return;
        }

        Usuario admin = Usuario.con(ADMIN_USERNAME, adminEmail, passwordEncoder.encode(adminPassword), TipoRol.ADMIN);
        usuarioRepository.save(admin);
        log.info("Usuario ADMIN por defecto creado con email '{}'.", adminEmail);
    }
}
