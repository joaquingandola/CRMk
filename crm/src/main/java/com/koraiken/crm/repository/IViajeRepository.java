package com.koraiken.crm.repository;
import com.koraiken.crm.model.EstadoConcretoViaje;
import com.koraiken.crm.model.EstadoViaje;
import com.koraiken.crm.model.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import com.koraiken.crm.model.Cliente;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface IViajeRepository extends JpaRepository<Viaje, Long> {
    List<Viaje> findByClienteIdCliente(Long id);
    List<Viaje> findByClienteAgenteIdUsuario(Long idAgente);


    List<Viaje> findByClienteIdClienteAndActivoTrue(Long id);

    List<Viaje> findByEstadosViaje_EstadoConcretoViaje(EstadoViaje estado);

    List<Viaje> findByFechaInicioViajeBetween(LocalDate desde, LocalDate hasta);
    List<Viaje> findByFechaInicioViajeBetweenAndClienteAgenteIdUsuario(
            LocalDate desde,
            LocalDate hasta,
            Long idAgente
    );


    @Query("""
        SELECT DISTINCT v.cliente
        FROM Viaje v
        JOIN EstadoViaje ev ON ev.viaje = v
        WHERE v.activo = true
            AND v.fechaInicioViaje <= :ahora
            AND v.fechaFinViaje >= :ahora
            AND (
                SELECT ev.estadoConcretoViaje
                FROM EstadoViaje ev
                WHERE ev.viaje = v
                ORDER BY ev.fechaActualizacion DESC
                LIMIT 1
            ) = :estadoConfirmado
""") List<Cliente> findClientesEnViajeAhora(
            @Param("ahora") LocalDate ahora,
            @Param("estadoConfirmado") EstadoConcretoViaje estadoConfirmado
            );

    @Query("""
        SELECT DISTINCT v.cliente
        FROM Viaje v
        JOIN EstadoViaje ev ON ev.viaje = v
        WHERE v.activo = true
            AND v.fechaInicioViaje <= :ahora
            AND v.fechaFinViaje >= :ahora
            AND (
                SELECT ev.estadoConcretoViaje
                FROM EstadoViaje ev
                WHERE ev.viaje = v
                ORDER BY ev.fechaActualizacion DESC
                LIMIT 1
            ) = :estadoConfirmado
""") List<Cliente> findClientesEnViajeAhoraByAgente(
            @Param("ahora") LocalDate ahora,
            @Param("estadoConfirmado") EstadoConcretoViaje estadoConfirmado,
            @Param("idAgente") Long idAgente
    );


    List<Viaje> findByAerolineaIdAerolinea(Long idAerolinea);

    boolean existsByIdViajeAndClienteAgenteIdUsuario(Long idViaje, Long idAgente);
    boolean existsByClienteIdClienteAndActivoTrue(Long idCliente);
}
