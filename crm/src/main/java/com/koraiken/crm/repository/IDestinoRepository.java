package com.koraiken.crm.repository;
import com.koraiken.crm.model.Destino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface IDestinoRepository extends JpaRepository<Destino, Long>{
    //Todos los destinos -escalas- de un viaje
    List<Destino> findByViajeIdViaje(Long idViaje);


    // Todos los destinos que incluyen una ciudad específica
    List<Destino> findByCiudadIdCiudad(Long idCiudad);

    // Destinos en un rango de fechas — para saber quién está viajando AHORA
    List<Destino> findByCiudadIdCiudadAndFechaLlegadaBeforeAndFechaSalidaAfter(
            Long idCiudad,
            LocalDateTime ahora1, // para fechaLlegada <= ahora
            LocalDateTime ahora2 // para fechaSalida >= ahora
    );


    // Para el dashboard: ciudades más visitadas (con conteo)
    @Query("""
        SELECT d.ciudad.idCiudad, d.ciudad.nombre, d.ciudad.pais.nombre, COUNT(d)
        FROM Destino d
        GROUP BY d.ciudad.idCiudad, d.ciudad.nombre, d.ciudad.pais.nombre
        ORDER BY COUNT(d) DESC
    """)
    List<Object[]> findCiudadesMasVisitadas();


    // Clientes que están en una ciudad en este momento
    // (navegando viaje → cliente)
    @Query("""
        SELECT d FROM Destino d
        WHERE d.ciudad.idCiudad = :idCiudad
        AND d.fechaLlegada <= :ahora
        AND d.fechaSalida >= :ahora
    """)
    List<Destino> findClientesEnCiudadAhora(
            @Param("idCiudad") Long idCiudad,
            @Param("ahora") LocalDateTime ahora
    );
}
