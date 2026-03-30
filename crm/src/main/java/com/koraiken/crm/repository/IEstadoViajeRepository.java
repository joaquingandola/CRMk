package com.koraiken.crm.repository;

import com.koraiken.crm.model.EstadoViaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IEstadoViajeRepository extends JpaRepository<EstadoViaje, Long> {
    List<EstadoViaje> findByViajeIdViajeOrderByFechaActualizacionDesc(Long IdViaje);

    //El estado actual es el último registrado
    @Query("""
        SELECT e FROM EstadoViaje e
        WHERE e.viaje.idViaje = :idViaje
        ORDER BY e.fechaActualizacion DESC
        LIMIT 1
    """)
    Optional<EstadoViaje> findEstadoActual(@Param("idViaje") Long idViaje);
}
