package com.koraiken.crm.controller;

import com.koraiken.crm.dto.Ciudad.CiudadCreateDTO;
import com.koraiken.crm.dto.Ciudad.CiudadResponseDTO;
import com.koraiken.crm.dto.Ciudad.CiudadVisitadaDTO;
import com.koraiken.crm.dto.Destino.DestinoCreateDTO;
import com.koraiken.crm.dto.Destino.DestinoResponseDTO;
import com.koraiken.crm.service.DestinoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/destinos")
@RequiredArgsConstructor
public class DestinoController {

    private final DestinoService destinoService;
    //---------------------------------------------------------------escalas-------------------------------------

    @PostMapping
    public ResponseEntity<DestinoResponseDTO> agregarDestino(@RequestBody DestinoCreateDTO dto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(destinoService.agregarDestino(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DestinoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(destinoService.buscarPorId(id));
    }

    @GetMapping("/viaje/{idViaje}")
    public ResponseEntity<List<DestinoResponseDTO>> listarPorViaje(@PathVariable Long idViaje) {
        return ResponseEntity.ok(destinoService.listarPorViaje(idViaje));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DestinoResponseDTO> actualizar(
            @PathVariable Long id,
            @RequestBody DestinoCreateDTO dto) {
        return ResponseEntity.ok(destinoService.actualizarDestino(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        destinoService.eliminarDestino(id);
        return ResponseEntity.noContent().build(); //204 operacion exitosa sin body
    }

    //------------------------------------------------------ciudades-------------------------------------------------

    // Solo ADMIN — la restricción está en SecurityConfig
    @PostMapping("/ciudades")
    public ResponseEntity<CiudadResponseDTO> crearCiudad(@RequestBody CiudadCreateDTO dto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(destinoService.crearCiudad(dto));
    }

    // GET /api/v1/destinos/ciudades/buscar?nombre=Bue
    @GetMapping("/ciudades/buscar")
    public ResponseEntity<List<CiudadResponseDTO>> buscarCiudad(@RequestParam String nombre) {
        return ResponseEntity.ok(destinoService.buscarCiudadPorNombre(nombre));
    }

    //-----------------------------------------------Dashboard-------------------------------------------------------
    @GetMapping("/dashboard/ciudades-visitadas")
    public ResponseEntity<List<CiudadVisitadaDTO>> ciudadesMasVisitadas() {
        return ResponseEntity.ok(destinoService.ciudadesMasVisitadas());
    }

    @GetMapping("/dashboard/en-ciudad/{idCiudad}")
    public ResponseEntity<List<DestinoResponseDTO>> clientesEnCiudadesAhora(
            @PathVariable Long idCiudad) {
        return ResponseEntity.ok(destinoService.clientesEnCiudadAhora(idCiudad));
    }

}
