package com.koraiken.crm.repository;

import com.koraiken.crm.model.Imagen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IImagenRepository extends JpaRepository<Imagen, Long> {
    List<Imagen> findByClienteIdCliente(Long idCliente);
    List<Imagen> findByAcompananteIdAcompanante(Long idAcompanante);
}
