package com.koraiken.crm.repository;

import com.koraiken.crm.model.Pais;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IPaisRepository extends JpaRepository<Pais, Long> {
    boolean existsByNombre(String nombre);
    Optional <Pais> findByNombre(String nombre); //para cachear
}
