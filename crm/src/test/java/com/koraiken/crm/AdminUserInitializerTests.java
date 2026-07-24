package com.koraiken.crm;

import com.koraiken.crm.config.AdminUserInitializer;
import com.koraiken.crm.model.TipoRol;
import com.koraiken.crm.model.Usuario;
import com.koraiken.crm.repository.IUsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminUserInitializerTests {

    @Mock private IUsuarioRepository usuarioRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks private AdminUserInitializer adminUserInitializer;

    private static final String ADMIN_EMAIL = "admin@crmk.com";
    private static final String ADMIN_PASSWORD = "admin123";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(adminUserInitializer, "adminEmail", ADMIN_EMAIL);
        ReflectionTestUtils.setField(adminUserInitializer, "adminPassword", ADMIN_PASSWORD);
    }

    @Nested
    @DisplayName("run")
    class Run {

        @Test
        @DisplayName("crea el admin con password encodeada cuando no existe ningun admin")
        void dadoSinAdminExistente_cuandoRun_entoncesCreaAdminConPasswordEncodeada() {
            when(usuarioRepository.existsByTipoRol(TipoRol.ADMIN)).thenReturn(false);
            when(usuarioRepository.existsByEmail(ADMIN_EMAIL)).thenReturn(false);
            when(usuarioRepository.existsByUsername("admin")).thenReturn(false);
            when(passwordEncoder.encode(ADMIN_PASSWORD)).thenReturn("hash-encodeado");

            adminUserInitializer.run();

            ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
            verify(usuarioRepository).save(captor.capture());
            verify(passwordEncoder).encode(ADMIN_PASSWORD);

            Usuario guardado = captor.getValue();
            assertThat(guardado.getNombreUsuario()).isEqualTo("admin");
            assertThat(guardado.getEmail()).isEqualTo(ADMIN_EMAIL);
            assertThat(guardado.getPassword()).isEqualTo("hash-encodeado");
            assertThat(guardado.getTipoRol()).isEqualTo(TipoRol.ADMIN);
        }

        @Test
        @DisplayName("no guarda ni encodea cuando ya existe un admin")
        void dadoUnAdminExistente_cuandoRun_entoncesNoGuardaNiEncodea() {
            when(usuarioRepository.existsByTipoRol(TipoRol.ADMIN)).thenReturn(true);

            adminUserInitializer.run();

            verify(usuarioRepository, never()).save(any());
            verify(passwordEncoder, never()).encode(any());
        }

        @Test
        @DisplayName("no guarda cuando el email o username configurados ya estan en uso")
        void dadoEmailOUsernameEnUso_cuandoRun_entoncesNoGuarda() {
            when(usuarioRepository.existsByTipoRol(TipoRol.ADMIN)).thenReturn(false);
            when(usuarioRepository.existsByEmail(ADMIN_EMAIL)).thenReturn(true);

            adminUserInitializer.run();

            verify(usuarioRepository, never()).save(any());
            verify(passwordEncoder, never()).encode(any());
        }
    }
}
