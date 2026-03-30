package com.koraiken.crm.repository;

import com.koraiken.crm.model.Ciudad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ICiudadRepository extends JpaRepository<Ciudad, Long> {
    // Autocomplete para el frontend al cargar un viaje
    List<Ciudad> findByNombreContainingIgnoreCase(String nombre);

    // Filtrar por país
    List<Ciudad> findByPaisIdPais(Long idPais);

    // Verificar duplicados al cargar ciudades
    boolean existsByNombreAndPaisIdPais(String nombre, Long idPais);
}
