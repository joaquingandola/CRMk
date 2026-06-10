package com.koraiken.crm.repository;

import com.koraiken.crm.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IHotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByNombreContainsIgnoreCase(String nombre);

    Optional<Hotel> findByNombreIgnoreCaseAndDireccion(String nombre, String direccion);

    boolean existsByNombreIgnoringCaseAndDireccion(String nombre, String direccion);

    Optional<Hotel> findByIdHotel(Long id);

    //Todos los hoteles dentro de un viaje especifico.
    //TODO

    @Query("""
        SELECT d.hotel.idHotel,
               d.hotel.nombre,
               d.hotel.direccion,
               COUNT(d) as cantidadVisitas
        FROM Destino d
        WHERE d.hotel is not null
        AND d.viaje.cliente.agente.idUsuario = :idAgente
        GROUP BY d.hotel.idHotel, d.hotel.nombre, d.hotel.direccion
        ORDER BY COUNT(d) DESC
        LIMIT 10
""")
    List<Object[]> findByAgenteHotelTop10(
            @Param("idAgente") Long idAgente
    );

    @Query("""
        SELECT d.hotel.idHotel,
               d.hotel.nombre, 
               d.hotel.direccion,
               COUNT(d) as cantidadVisitas
        FROM Destino d
        WHERE d.hotel IS NOT NULL
        GROUP BY d.hotel.idHotel, d.hotel.nombre, d.hotel.direccion
        ORDER BY COUNT(d) DESC
        LIMIT 10 
""")
    List<Object[]> findByHotelTop10();
}
