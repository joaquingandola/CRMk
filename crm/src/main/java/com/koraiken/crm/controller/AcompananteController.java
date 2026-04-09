package com.koraiken.crm.controller;

import com.koraiken.crm.dto.Acompanante.AcompananteCreateDTO;
import com.koraiken.crm.dto.Acompanante.AcompananteResponseDTO;
import com.koraiken.crm.service.AcompananteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/acompanantes")
@RequiredArgsConstructor
public class AcompananteController {

    private final AcompananteService acompananteService;

    @PostMapping
    public ResponseEntity<AcompananteResponseDTO> crear(@RequestBody AcompananteCreateDTO dto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(acompananteService.crearAcompanante(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AcompananteResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(acompananteService.buscarPorId(id));
    }

    //GET /api/v1/acompanantes/buscar?termino=juan
    @GetMapping("/buscar")
    public ResponseEntity<List<AcompananteResponseDTO>> buscarPorNombre(@RequestParam String termino) {
        return ResponseEntity.ok(acompananteService.buscarPorNombreOApellido(termino));
    }

    @GetMapping("/viaje/{idViaje}")
    public ResponseEntity<List<AcompananteResponseDTO>> listarPorViaje(
            @PathVariable Long idViaje) {
        return ResponseEntity.ok(acompananteService.listarPorViaje(idViaje));
    }

}
