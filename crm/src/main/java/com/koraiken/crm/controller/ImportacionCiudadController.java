package com.koraiken.crm.controller;

import com.koraiken.crm.dto.Importacion.ImportacionResultadoDTO;
import com.koraiken.crm.service.ImportacionCiudadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/ciudades")
public class ImportacionCiudadController {
    private final ImportacionCiudadService importacionCiudadService;
    // POST /api/v1/admin/ciudades/importar
    // Content-Type: multipart/form-data
    // Body: archivo = worldcities.csv
    @PostMapping("/importar")
    public ResponseEntity<ImportacionResultadoDTO> importar(@RequestParam("archivo")MultipartFile archivo) {
        if(archivo.isEmpty()) {
            throw new RuntimeException("El archivo esta vacio");
        }
        if (!archivo.getOriginalFilename().endsWith(".csv")) {
            throw new RuntimeException("El archivo tiene que ser un csv");
        }

        return ResponseEntity.ok(importacionCiudadService.importarCiudades(archivo));
    }
}
