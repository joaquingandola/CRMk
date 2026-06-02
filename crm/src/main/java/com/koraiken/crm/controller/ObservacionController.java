package com.koraiken.crm.controller;

import com.koraiken.crm.dto.Observacion.ObservacionCreateDTO;
import com.koraiken.crm.dto.Observacion.ObservacionResponseDTO;
import com.koraiken.crm.service.ObservacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/clientes/{idCliente}/observaciones")
public class ObservacionController {
    private final ObservacionService observacionService;

    @PostMapping
    public ResponseEntity<ObservacionResponseDTO> crear (
            @PathVariable Long idCliente,
            @RequestBody ObservacionCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(observacionService.crearObservacion(idCliente, dto));
    }

    @GetMapping
    public ResponseEntity<List<ObservacionResponseDTO>> listar (
            @PathVariable Long idCliente) {
        return ResponseEntity.ok(observacionService.listarPorCliente(idCliente));
    }

    @DeleteMapping("/{idObservacion}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long idObservacion) {
        observacionService.eliminarObservacion(idObservacion);
        return ResponseEntity.noContent().build();
    }
}
