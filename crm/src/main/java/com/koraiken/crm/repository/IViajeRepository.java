package com.koraiken.crm.repository;
import com.koraiken.crm.model.EstadoViaje;
import com.koraiken.crm.model.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import com.koraiken.crm.model.Cliente;


public interface IViajeRepository extends JpaRepository<Viaje, Long> {
    // Buscar todos los viajes de un cliente
    List<Viaje> findByClienteIdCliente(Long id);

    // Viajes activos de un cliente (para saber si está viajando ahora)
    List<Viaje> findByClienteIdClienteAndActivoTrue(Long id);

    // Buscar por estado (COTIZADO, PAGADO, CANCELADO, CONFIRMADO)
    List<Viaje> findByEstadoViaje_EstadoConcretoViaje(EstadoViaje estado);

    // Viajes en un rango de fechas (útil para reportes)
    List<Viaje> findByFechaSalidaBetween(LocalDateTime desde, LocalDateTime hasta);

    // Viajes por aerolinea
    List<Viaje> findByAerolineaIdAerolinea(Long idAerolinea);

    // Verificar si un cliente tiene viajes activos (para no borrarlo)
    boolean existsByClienteIdClienteAndActivoTrue(Long idCliente);
}
