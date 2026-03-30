package com.koraiken.crm.repository;

import com.koraiken.crm.model.Pais;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IPaisRepository extends JpaRepository<Pais, Long> {
    boolean existsByPais(String pais);
}
