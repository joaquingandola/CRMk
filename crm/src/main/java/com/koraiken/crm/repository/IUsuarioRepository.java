package com.koraiken.crm.repository;
import com.koraiken.crm.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface IUsuarioRepository extends JpaRepository<Usuario, Long>{
    Optional<Usuario> findByIdUsuario(Long id);

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByUsername(String username);

    boolean existsByEmail(String email);
}
