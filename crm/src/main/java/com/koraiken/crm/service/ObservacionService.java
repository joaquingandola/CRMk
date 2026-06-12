package com.koraiken.crm.service;

import com.koraiken.crm.dto.Observacion.ObservacionCreateDTO;
import com.koraiken.crm.dto.Observacion.ObservacionResponseDTO;
import com.koraiken.crm.exception.ObservacionNoEncontradaException;
import com.koraiken.crm.exception.UserMailNotFoundException;
import com.koraiken.crm.model.Cliente;
import com.koraiken.crm.model.Observacion;
import com.koraiken.crm.model.Usuario;
import com.koraiken.crm.repository.IObservacionRepository;
import com.koraiken.crm.repository.IUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ObservacionService {

    private final ClienteService clienteService;
    private final IUsuarioRepository usuarioRepository;
    private final IObservacionRepository observacionRepository;

    private Usuario obtenerUserAuth() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UserMailNotFoundException(email));
    }

    @Transactional
    public ObservacionResponseDTO crearObservacion(Long idCliente, ObservacionCreateDTO dto) {
        Cliente cliente = clienteService.obtenerClienteOExcepcion(idCliente);

        verificarPermisos(cliente);
        Observacion observacion = new Observacion();
        observacion.setObservacion(dto.getObservacion());
        observacion.setCliente(cliente);
        observacion.setFechaCreacion(LocalDateTime.now());

        return toDTO(observacionRepository.save(observacion));
    }

    @Transactional(readOnly = true)
    public List<ObservacionResponseDTO> listarPorCliente(Long idCliente) {
        Cliente cliente = clienteService.obtenerClienteOExcepcion(idCliente);
        verificarPermisos(cliente);
        return observacionRepository
                .findByClienteIdClienteOrderByFechaCreacionDesc(idCliente)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public ObservacionResponseDTO modificarObservacion(Long idCliente, Long idObservacion, ObservacionCreateDTO dto) {
        Cliente cliente = clienteService.obtenerClienteOExcepcion(idCliente);
        verificarPermisos(cliente);
        Observacion obs = obtenerOExcepcion(idObservacion);
        validarObsPerteneceCliente(obs, cliente);
        obs.setObservacion(dto.getObservacion());
        return toDTO(observacionRepository.save(obs));
    }

    @Transactional
    public void eliminarObservacion(Long idObservacion) {
        Observacion obs = obtenerOExcepcion(idObservacion);
        Cliente cliente = obs.getCliente();
        verificarPermisos(cliente);
        validarObsPerteneceCliente(obs, cliente);
        observacionRepository.delete(obs);
    }

    // ------------ metodos auxiliares ------------------
    private void validarObsPerteneceCliente(Observacion obs, Cliente cliente) {
        if(!obs.getCliente().getIdCliente().equals(cliente.getIdCliente())) {
            throw new IllegalArgumentException("Observacion no pertenece a este cliente");
        }
    }

    private Observacion obtenerOExcepcion(Long idObservacion) {
        return observacionRepository.findById(idObservacion)
                .orElseThrow(() -> new ObservacionNoEncontradaException(idObservacion));
    }

    private ObservacionResponseDTO toDTO(Observacion obs) {
        return ObservacionResponseDTO.builder()
                .idObservacion(obs.getIdObservacion())
                .idCliente(obs.getCliente().getIdCliente())
                .observacion(obs.getObservacion())
                .fechaCreacion(obs.getFechaCreacion())
                .build();
    }

    private void verificarPermisos(Cliente cliente) {
        Usuario usuario = obtenerUserAuth();
        if(!usuario.getTipoRol().isAdmin() && !cliente.getAgente().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new AccessDeniedException("No tenes permisos para realizar esta accion");
        }
    }
}
