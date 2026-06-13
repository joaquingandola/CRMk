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


    Optional<Hotel> findByIdHotel(Long id);


}
