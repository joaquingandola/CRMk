package com.koraiken.crm.service;

import com.koraiken.crm.dto.Observacion.ObservacionCreateDTO;
import com.koraiken.crm.dto.Observacion.ObservacionResponseDTO;
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
        Usuario usuario = obtenerUserAuth();

        if(!usuario.getTipoRol().isAdmin() && !cliente.getAgente().getIdUsuario().equals(usuario.getIdUsuario()))
            throw new AccessDeniedException("No tenes permisos para ver al cliente");
        Observacion observacion = new Observacion();
        observacion.setObservacion(dto.getObservacion());
        observacion.setCliente(cliente);
        observacion.setFechaCreacion(LocalDateTime.now());

        return toDTO(observacionRepository.save(observacion));
    }

    @Transactional(readOnly = true)
    public List<ObservacionResponseDTO> listarPorCliente(Long idCliente) {
        Usuario usuario = obtenerUserAuth();
        Cliente cliente = clienteService.obtenerClienteOExcepcion(idCliente);
        if(!usuario.getTipoRol().isAdmin() && !cliente.getAgente().getIdUsuario().equals(usuario.getIdUsuario()))
            throw new AccessDeniedException("No tenes permisos");
        return observacionRepository
                .findByClienteIdClienteOrderByFechaCreacionDesc(idCliente)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public void eliminarObservacion(Long idObservacion) {
        Observacion obs = observacionRepository.findById(idObservacion)
                .orElseThrow(() -> new RuntimeException("No existe la observacion con id: " + idObservacion));

        Usuario usuario = obtenerUserAuth();
        if(!usuario.getTipoRol().isAdmin() && !obs.getCliente().getAgente().getIdUsuario().equals(usuario.getIdUsuario()))
            throw new AccessDeniedException("No tenes los permisos para eliminar la observacion");
        observacionRepository.deleteById(idObservacion);
    }

    private ObservacionResponseDTO toDTO(Observacion obs) {
        return ObservacionResponseDTO.builder()
                .idObservacion(obs.getIdObservacion())
                .idCliente(obs.getCliente().getIdCliente())
                .observacion(obs.getObservacion())
                .fechaCreacion(obs.getFechaCreacion())
                .build();
    }
}
