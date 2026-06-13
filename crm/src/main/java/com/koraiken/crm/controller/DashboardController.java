package com.koraiken.crm.controller;
import com.koraiken.crm.dto.Ciudad.CiudadVisitadaDTO;
import com.koraiken.crm.dto.Destino.DestinoResponseDTO;
import com.koraiken.crm.dto.Hotel.HotelVisitadoDTO;
import com.koraiken.crm.service.DestinoService;
import com.koraiken.crm.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DestinoService destinoService;

    @GetMapping("/ciudades-visitadas")
    public ResponseEntity<List<CiudadVisitadaDTO>> ciudadesMasVisitadas() {
        return ResponseEntity.ok(destinoService.ciudadesMasVisitadas());
    }

    @GetMapping("/en-ciudad/{idCiudad}")
    public ResponseEntity<List<DestinoResponseDTO>> clientesEnCiudadesAhora(
            @PathVariable Long idCiudad) {
        return ResponseEntity.ok(destinoService.clientesEnCiudadAhora(idCiudad));
    }
}
