package com.koraiken.crm.controller;


import com.koraiken.crm.dto.EstadoViaje.EstadoViajeResponseDTO;
import com.koraiken.crm.dto.Viaje.ViajeCreateDTO;
import com.koraiken.crm.dto.Viaje.ViajeResponseDTO;
import com.koraiken.crm.dto.Viaje.ViajeUpdateDTO;
import com.koraiken.crm.model.EstadoConcretoViaje;
import com.koraiken.crm.service.ViajeService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/viajes")
public class ViajeController {

    private final ViajeService viajeService;

    @PostMapping
    public ResponseEntity<ViajeResponseDTO> crear(@RequestBody ViajeCreateDTO dto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(viajeService.crearViaje(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ViajeResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(viajeService.buscarPorId(id));
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<ViajeResponseDTO>> listarPorCliente(@PathVariable Long idCliente) {
        return ResponseEntity.ok(viajeService.listarPorCliente(idCliente));
    }

    // GET /api/v1/viajes/rango?desde=2025-01-01T00:00:00&hasta=2025-12-31T23:59:59
    // @DateTimeFormat indica a Spring cómo parsear el LocalDateTime que viene como String en la URL
    @GetMapping("/rango")
    public ResponseEntity<List<ViajeResponseDTO>> listarPorRango(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime hasta) {
        return ResponseEntity.ok(viajeService.listarPorRangoFechas(desde,hasta));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ViajeResponseDTO> actualizar(
            @PathVariable Long id,
            @RequestBody ViajeUpdateDTO dto) {
        return ResponseEntity.ok(viajeService.actualizarViaje(id, dto));
    }

    //------------------------------estado-----------------------------
    // PATCH /api/v1/viajes/1/estado?nuevo=CONFIRMADO
    //nuevo estado viene como String en url
    @PatchMapping("/{id}/estado")
    public ResponseEntity<ViajeResponseDTO> cambiarEstado(
            @PathVariable Long id,
            @RequestParam EstadoConcretoViaje nuevo) {
        return ResponseEntity.ok(viajeService.cambiarEstado(id, nuevo));
    }

    @GetMapping("/{id}/estados")
    public ResponseEntity<List<EstadoViajeResponseDTO>> historialEstados(@PathVariable Long id) {
        return ResponseEntity.ok(viajeService.historialEstados(id));
    }

    //------------acompanantes -------------------
    
}
