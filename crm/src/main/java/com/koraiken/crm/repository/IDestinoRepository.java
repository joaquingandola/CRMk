package com.koraiken.crm.repository;
import com.koraiken.crm.model.Destino;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IDestinoRepository extends JpaRepository<Destino, Long>{
    //BUSCAR POR NOMBRE
    Optional<Destino> findByNombre(String destino);
    //BUSCAR por pais para filtros
    List<Destino> findByPais(String pais);

    // Buscador por nombre parcial (para autocomplete en el frontend)
    List<Destino> findByNombreContainingIgnoreCase(String nombre);

    boolean existsByNombre(String nombre);
}
