package com.koraiken.crm.service;


import com.koraiken.crm.dto.Aerolinea.AerolineaCreateDTO;
import com.koraiken.crm.dto.Aerolinea.AerolineaResponseDTO;
import com.koraiken.crm.exception.AerolineaNotFoundException;
import com.koraiken.crm.model.Aerolinea;
import com.koraiken.crm.repository.IAerolineaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class AerolineaService {

    private final IAerolineaRepository aerolineaRepository;

    @Transactional
    public AerolineaResponseDTO crearAeroliena(AerolineaCreateDTO dto) {
        if (aerolineaRepository.existsByAerolinea(dto.getAerolinea())) {
            throw new RuntimeException("Ya existe la aerolinea: " + dto.getAerolinea());
        }
        Aerolinea aerolinea = new Aerolinea();
        aerolinea.setAerolinea(dto.getAerolinea());
        return toDTO(aerolineaRepository.save(aerolinea));
    }

    @Transactional(readOnly = true)
    public List<AerolineaResponseDTO> listarTodas() {
        return aerolineaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    //reutilizable desde viajeservice
    public Aerolinea obtenerAerolineaOExcepcion(Long idAerolinea) {
        return aerolineaRepository.findById(idAerolinea)
                .orElseThrow(() -> new AerolineaNotFoundException(idAerolinea));
    }

    private AerolineaResponseDTO toDTO(Aerolinea a) {
        return AerolineaResponseDTO.builder()
                .idAerolinea(a.getIdAerolinea())
                .aerolinea(a.getAerolinea())
                .build();
    }
}
