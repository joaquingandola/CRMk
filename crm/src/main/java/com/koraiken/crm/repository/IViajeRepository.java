package com.koraiken.crm.repository;
import com.koraiken.crm.model.EstadoViaje;
import com.koraiken.crm.model.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import com.koraiken.crm.model.Cliente;


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




    List<Viaje> findByAerolineaIdAerolinea(Long idAerolinea);

    boolean existsByIdViajeAndClienteAgenteIdUsuario(Long idViaje, Long idAgente);
    boolean existsByClienteIdClienteAndActivoTrue(Long idCliente);
}
