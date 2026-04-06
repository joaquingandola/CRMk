package com.koraiken.crm.repository;

import com.koraiken.crm.model.Aerolinea;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IAerolineaRepository extends JpaRepository <Aerolinea, Long> {

    boolean existsByAerolinea(String aerolinea);

}
