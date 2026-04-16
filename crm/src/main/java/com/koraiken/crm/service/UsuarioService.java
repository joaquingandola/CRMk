package com.koraiken.crm.service;


import com.koraiken.crm.dto.Usuario.UsuarioResponseDTO;
import com.koraiken.crm.dto.Usuario.UsuarioUpdateDTO;
import com.koraiken.crm.exception.UserNotFoundException;
import com.koraiken.crm.model.Usuario;
import com.koraiken.crm.repository.IUsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class UsuarioService {
    private final IUsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPorId(Long id) {
        return toDTO(obtenerUsuarioOExcepcion(id));
    }

    //crear transactional readonly de buscarpormail y delegarlo al service

    //update
    @Transactional
    public UsuarioResponseDTO actualizarUsuario(Long id, UsuarioUpdateDTO dto) {
        Usuario usuario = obtenerUsuarioOExcepcion(id);
        if(dto.getUsername() != null) usuario.setUsername(dto.getUsername());
        if(dto.getTipoRol() != null) usuario.setTipoRol(dto.getTipoRol());

        return toDTO(usuarioRepository.save(usuario));
    }

    //baja logica -> desactivo, no borro
    @Transactional
    public void desactivarUsuario(Long id) {
        Usuario usuario = obtenerUsuarioOExcepcion(id);
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void reactivarUsuario(Long id) {
        Usuario usuario = obtenerUsuarioOExcepcion(id);
        usuario.setActivo(true);
        usuarioRepository.save(usuario);
    }


    public Usuario obtenerUsuarioOExcepcion(Long id) {
        return usuarioRepository.findByIdUsuario(id)
                .orElseThrow(()-> new UserNotFoundException(id));
    }

    public UsuarioResponseDTO toDTO(Usuario u) {
        return UsuarioResponseDTO.builder()
                .idUsuario(u.getIdUsuario())
                .username(u.getUsername())
                .email(u.getEmail())
                .tipoRol(u.getTipoRol())
                .activo(u.isActivo())
                .build();
    }

}
