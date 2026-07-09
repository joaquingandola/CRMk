package com.koraiken.crm.service;

import com.koraiken.crm.dto.Acompanante.AcompananteCreateDTO;
import com.koraiken.crm.dto.Acompanante.AcompananteResponseDTO;
import com.koraiken.crm.exception.AcompananteNotFoundException;
import com.koraiken.crm.model.Acompanante;
import com.koraiken.crm.repository.IAcompananteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AcompananteService {

    private final IAcompananteRepository acompananteRepository;

    @Transactional
    public AcompananteResponseDTO crearAcompanante(AcompananteCreateDTO dto) {
        Acompanante acompanante = new Acompanante();
        acompanante.setNombre(dto.getNombre());
        acompanante.setApellido(dto.getApellido());
        acompanante.setDni(dto.getDni());
        acompanante.setFechaNacimiento(dto.getFechaNacimiento());

        return toDTO(acompananteRepository.save(acompanante));
    }

    @Transactional
    public AcompananteResponseDTO modificarAcompanante(Long id, AcompananteCreateDTO dto) {
        Acompanante acompanante = obtenerAcompananteOExcepcion(id);

        if(dto.getApellido() != null) acompanante.setApellido(dto.getApellido());
        if(dto.getNombre() != null) acompanante.setNombre(dto.getNombre());
        if(dto.getDni() != null) acompanante.setDni(dto.getDni());
        if(dto.getFechaNacimiento() != null) acompanante.setFechaNacimiento(dto.getFechaNacimiento());

        Acompanante actualizado = acompananteRepository.save(acompanante);
        return toDTO(actualizado);
    }

    @Transactional
    public void eliminarAcompanante(Long id) {
        Acompanante acompanante = obtenerAcompananteOExcepcion(id);
        if(!acompanante.getViajes().isEmpty()) {
            throw new RuntimeException("No se puede eliminar al acompanante");
        }
        acompananteRepository.delete(acompanante);
    }

    @Transactional(readOnly = true)
    public AcompananteResponseDTO buscarPorId(Long id) {
        return toDTO(obtenerAcompananteOExcepcion(id));
    }

    @Transactional(readOnly = true)
    public List<AcompananteResponseDTO> buscarPorNombreOApellido(String termino){
        return acompananteRepository
                .findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(termino, termino)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AcompananteResponseDTO> listarPorViaje(Long idViaje) {
        return acompananteRepository.findByViajes_IdViaje(idViaje)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public Acompanante obtenerAcompananteOExcepcion(Long id) {
        return acompananteRepository.findById(id)
                .orElseThrow(()->new AcompananteNotFoundException(id));
    }

    private AcompananteResponseDTO toDTO(Acompanante a) {
        return AcompananteResponseDTO.builder()
                .idAcompanante(a.getIdAcompanante())
                .nombre(a.getNombre())
                .apellido(a.getApellido())
                .dni(a.getDni())
                .fechaNacimiento(a.getFechaNacimiento())
                .build();
    }
}
