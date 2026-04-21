package com.koraiken.crm.controller;

import com.koraiken.crm.dto.Cliente.ClienteCreateDTO;
import com.koraiken.crm.dto.Cliente.ClienteResponseDTO;
import com.koraiken.crm.dto.Cliente.ClienteUpdateDTO;
import com.koraiken.crm.mapper.ClienteMapper;
import com.koraiken.crm.repository.IClienteRepository;
import com.koraiken.crm.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;
    private final IClienteRepository clienteRepository;

    @GetMapping("/en-viaje")
    public ResponseEntity<ClienteResponseDTO> listarEnViaje() {
        return clienteRepository.findByEnViajeTrue()
                .stream()
                .map(ClienteMapper::toDTO)
                .toList();
    }


    @PostMapping
    public ResponseEntity<ClienteResponseDTO> crear(@RequestBody ClienteCreateDTO dto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(clienteService.crearCliente(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.buscarPorId(id));
    }

    @GetMapping("/activos")
    public ResponseEntity<List<ClienteResponseDTO>> listarActivos() {
        return ResponseEntity.ok(clienteService.listarActivos());
    }

    // GET /api/v1/clientes/buscar?termino=Juan
    @GetMapping("/buscar")
    public ResponseEntity<List<ClienteResponseDTO>> buscar(@RequestParam String termino) {
        return ResponseEntity.ok(clienteService.buscarPorNombreOApellido(termino));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> actualizar(@PathVariable Long id, @RequestBody ClienteUpdateDTO dto) {
        return ResponseEntity.ok(clienteService.actualizarCliente(id, dto));
    }

    @PatchMapping("/{id}/baja")
    public ResponseEntity<Void> darDeBaja(@PathVariable Long id) {
        clienteService.darDeBaja(id);
        return ResponseEntity.noContent().build();
    }

}
