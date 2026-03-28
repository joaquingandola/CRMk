package com.koraiken.crm.repository;

import com.koraiken.crm.model.Contacto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IContactoRepository extends JpaRepository<Contacto, Long> {
    boolean existsByDetalle(String detalle);
}
