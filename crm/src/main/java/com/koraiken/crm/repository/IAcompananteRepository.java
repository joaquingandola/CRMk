package com.koraiken.crm.repository;
import com.koraiken.crm.model.Acompanante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IAcompananteRepository extends JpaRepository<Acompanante, Long>{
    Optional<Acompanante> findByDni(Integer dni);

    //buscar por nombre completo
    Optional<Acompanante> findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(
            String nombre, String apellido
    );

    // Todos los acompañantes de un viaje específico
    // (navegando por la relación ManyToMany)
    List<Acompanante> findByViajes_IdViaje(Long idViaje);

    boolean existsByDni(Integer dni);
}
