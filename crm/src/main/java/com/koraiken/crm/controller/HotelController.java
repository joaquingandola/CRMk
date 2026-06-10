package com.koraiken.crm.controller;

import com.koraiken.crm.dto.Hotel.HotelCreateDTO;
import com.koraiken.crm.dto.Hotel.HotelResponseDTO;
import com.koraiken.crm.dto.Hotel.HotelVisitadoDTO;
import com.koraiken.crm.model.Hotel;
import com.koraiken.crm.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/destinos/{idDestino}/hoteles")
public class HotelController {
    private final HotelService hotelService;

    @PostMapping
    public ResponseEntity<Hotel> crearHotel(@RequestBody HotelCreateDTO hotelCreateDTO) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(hotelService.obteneroCrear(hotelCreateDTO));
    }

    //falta modificar y eliminar, capaz un get para buscar
    @GetMapping("/dashboard/top-hoteles")
    public ResponseEntity<List<HotelVisitadoDTO>> topHoteles() {
        return ResponseEntity.ok(hotelService.listarHotelesTop10());
    }

    @GetMapping("/hoteles/buscar")
    public ResponseEntity<List<HotelResponseDTO>> buscarHotel(@RequestParam String nombre) {
        return ResponseEntity.ok(
                hotelService.buscarPorNombre(nombre)
                        .stream()
                        .map(h -> HotelResponseDTO.builder()
                                .idHotel(h.getIdHotel())
                                .nombre(h.getNombre())
                                .direccion(h.getDireccion())
                                .build()
                        ).toList()
        );
    }

}
