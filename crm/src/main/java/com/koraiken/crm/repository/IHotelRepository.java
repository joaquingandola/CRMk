package com.koraiken.crm.repository;

import com.koraiken.crm.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IHotelRepository extends JpaRepository<Hotel, Long> {
    Optional<Hotel> findByNombreContainsIgnoreCase(String nombre);

    //Todos los hoteles dentro de un viaje especifico.
    //TODO

}
