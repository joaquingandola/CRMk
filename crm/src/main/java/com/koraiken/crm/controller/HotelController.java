package com.koraiken.crm.controller;

import com.koraiken.crm.dto.Hotel.HotelCreateDTO;
import com.koraiken.crm.dto.Hotel.HotelResponseDTO;
import com.koraiken.crm.dto.Hotel.HotelUpdateDTO;
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

    @GetMapping("/hoteles/buscar/{idHotel}")
    public ResponseEntity<Hotel> buscarHotelPorId(@RequestParam Long id) {
        return ResponseEntity.ok(hotelService.obtenerOExcepcion(id));
    }

    @DeleteMapping("/{idHotel}")
    public ResponseEntity<Void> eliminarHotel(@PathVariable Long idHotel) {
        hotelService.eliminarHotel(idHotel);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{idHotel}")
    public ResponseEntity<HotelResponseDTO> modificarHotel(
            @PathVariable Long idHotel,
            @RequestBody HotelUpdateDTO dto) {
        return ResponseEntity.ok(hotelService.modificarHotel(idHotel, dto));
    }
}
