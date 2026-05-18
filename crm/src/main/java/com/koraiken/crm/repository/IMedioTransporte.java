package com.koraiken.crm.repository;

import com.koraiken.crm.model.MedioTransporte;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IMedioTransporte extends JpaRepository<MedioTransporte, Long> {
    Optional<MedioTransporte> findByCodigo(
            String codigo
    );
}
