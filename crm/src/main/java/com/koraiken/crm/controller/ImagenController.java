package com.koraiken.crm.controller;

import com.koraiken.crm.dto.Imagen.ImagenResponseDTO;
import com.koraiken.crm.model.TipoDocumento;
import com.koraiken.crm.service.ImagenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/imagenes")
public class ImagenController {

    private final ImagenService imagenService;

    @PostMapping("/clientes/{idCliente}")
    public ResponseEntity<ImagenResponseDTO> subirParaCliente(
            @PathVariable Long idCliente,
            @RequestParam("archivo")MultipartFile archivo,
            @RequestParam TipoDocumento tipoDocumento,
            @RequestParam(required = false, defaultValue = "") String alt) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(imagenService.subirImagenCliente(idCliente, archivo, tipoDocumento, alt));
    }

    @GetMapping("/clientes/{idCliente}")
    public ResponseEntity<List<ImagenResponseDTO>> listardeCliente (
            @PathVariable Long idCliente) {
        return ResponseEntity.ok(imagenService.listarImagenesPorCliente(idCliente));
    }


    @PostMapping("/acompanantes/{idAcompanante}")
    public ResponseEntity<ImagenResponseDTO> subirParaAcompanante(
            @PathVariable Long idAcompanante,
            @RequestParam("archivo")MultipartFile archivo,
            @RequestParam TipoDocumento tipoDocumento,
            @RequestParam(required = false, defaultValue = "") String alt) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(imagenService.subirImagenAcompanante(idAcompanante, archivo, tipoDocumento, alt));
    }

    @GetMapping("acompanantes/{idAcompanante}")
    public ResponseEntity<List<ImagenResponseDTO>> listardeAcompanante(
            @PathVariable Long idAcompanante) {
        return ResponseEntity
                .ok(imagenService.listarImagenesPorAcompanante(idAcompanante));
    }

    //eliminar
    @DeleteMapping("/{idImagen}")
    public ResponseEntity<Void> eliminar(@PathVariable Long idImagen) {
        imagenService.eliminarImagen(idImagen);
        return ResponseEntity.noContent().build();
    }
}
