package com.koraiken.crm.repository;

import com.koraiken.crm.model.Observacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IObservacionRepository extends JpaRepository<Observacion, Long> {

    List<Observacion> findByClienteIdClienteOrderByFechaCreacionDesc(Long idCliente);
}
