package com.koraiken.crm.controller;

import com.koraiken.crm.dto.Hotel.HotelCreateDTO;
import com.koraiken.crm.dto.Hotel.HotelResponseDTO;
import com.koraiken.crm.model.Hotel;
import com.koraiken.crm.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/destinos/{idDestino}/hoteles")
public class HotelController {
    private final HotelService hotelService;

    @PostMapping
    public ResponseEntity<Hotel> crearHotel(@RequestBody HotelCreateDTO hotelCreateDTO) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(hotelService.crearHotel(hotelCreateDTO));
    }

    //falta modificar y eliminar, capaz un get para buscar

}
