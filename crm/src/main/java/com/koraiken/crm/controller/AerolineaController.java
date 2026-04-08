package com.koraiken.crm.controller;


import com.koraiken.crm.dto.Aerolinea.AerolineaCreateDTO;
import com.koraiken.crm.dto.Aerolinea.AerolineaResponseDTO;
import com.koraiken.crm.service.AerolineaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/aerolineas")
@RequiredArgsConstructor
public class AerolineaController {
    private final AerolineaService aerolineaService;

    @PostMapping
    public ResponseEntity<AerolineaResponseDTO> crear(@RequestBody AerolineaCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(aerolineaService.crearAeroliena(dto));
    }

    @GetMapping
    public ResponseEntity<List<AerolineaResponseDTO>> listar() {
        return ResponseEntity.ok(aerolineaService.listarTodas());
    }

}
