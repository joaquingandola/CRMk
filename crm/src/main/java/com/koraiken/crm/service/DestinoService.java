package com.koraiken.crm.service;

import com.koraiken.crm.dto.Ciudad.CiudadCreateDTO;
import com.koraiken.crm.dto.Ciudad.CiudadResponseDTO;
import com.koraiken.crm.dto.Ciudad.CiudadVisitadaDTO;
import com.koraiken.crm.dto.Destino.DestinoCreateDTO;
import com.koraiken.crm.dto.Destino.DestinoResponseDTO;
import com.koraiken.crm.exception.*;
import com.koraiken.crm.mapper.DestinoMapper;
import com.koraiken.crm.model.Ciudad;
import com.koraiken.crm.model.Destino;
import com.koraiken.crm.model.Pais;
import com.koraiken.crm.model.Viaje;
import com.koraiken.crm.repository.ICiudadRepository;
import com.koraiken.crm.repository.IDestinoRepository;
import com.koraiken.crm.repository.IPaisRepository;
import com.koraiken.crm.repository.IViajeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DestinoService {

    private final IDestinoRepository destinoRepository;
    private final ICiudadRepository ciudadRepository;
    private final IViajeRepository viajeRepository;
    private final IPaisRepository paisRepository;


    // destinos
    @Transactional
    public DestinoResponseDTO agregarDestino(DestinoCreateDTO dto) {
        //validar que fechaLlegada < fechaSalida
        if(!dto.getFechaLlegada().isBefore(dto.getFechaSalida())) {
            throw new DestinoFechaInvalidaException();
        }

        Ciudad ciudad = obtenerCiudadOExcepcion(dto.getIdCiudad());

        Viaje viaje = viajeRepository.findById(dto.getIdViaje())
                .orElseThrow(() -> new RuntimeException(
                        "No existe un viaje con id: " + dto.getIdViaje()
                ));

        Destino destino = new Destino();
        destino.setCiudad(ciudad);
        destino.setViaje(viaje);
        destino.setFechaLlegada(dto.getFechaLlegada());
        destino.setFechaSalida(dto.getFechaSalida());

        return DestinoMapper.toDTO(destinoRepository.save(destino));
    }

    @Transactional(readOnly = true)
    public DestinoResponseDTO buscarPorId(Long id) {
        return DestinoMapper.toDTO(obtenerDestinoOExcepcion(id));
    }

    @Transactional(readOnly = true)
    public List<DestinoResponseDTO> listarPorViaje(Long idViaje) {
        return destinoRepository.findByViajeIdViaje(idViaje)
                .stream()
                .map(DestinoMapper::toDTO)
                .toList();
    }

    @Transactional
    public DestinoResponseDTO actualizarDestino(Long id, DestinoCreateDTO dto) {
        Destino destino = obtenerDestinoOExcepcion(id);

        if(dto.getFechaLlegada() != null && dto.getFechaSalida() != null) {
            if (!dto.getFechaLlegada().isBefore(dto.getFechaSalida())) {
                throw new DestinoFechaInvalidaException();
            }
            destino.setFechaLlegada(dto.getFechaLlegada());
            destino.setFechaSalida(dto.getFechaSalida());
        }

        if(dto.getIdCiudad() != null) {
            destino.setCiudad(obtenerCiudadOExcepcion(dto.getIdCiudad()));
        }

        return DestinoMapper.toDTO(destinoRepository.save(destino));
    }

    @Transactional
    public void eliminarDestino(Long id) {
        obtenerDestinoOExcepcion(id);
        destinoRepository.deleteById(id);
    }


    // -------------------------------------------------------DASHBOARD -------------------------------------------------
    // Devuelve qué clientes están en cada ciudad en este momento
    // La query ya está definida en IDestinoRepository
    @Transactional(readOnly = true)
    public List<DestinoResponseDTO> clientesEnCiudadAhora(Long idCiudad) {
        LocalDateTime ahora = LocalDateTime.now();
        return destinoRepository.findClientesEnCiudadAhora(idCiudad, ahora)
                .stream()
                .map(DestinoMapper::toDTO)
                .toList();
    }

    // Para el widget de ciudades más visitadas del dashboard
    // Devuelve una proyección limpia en lugar de Object[]
    @Transactional(readOnly = true)
    public List<CiudadVisitadaDTO> ciudadesMasVisitadas() {
        return destinoRepository.findCiudadesMasVisitadas()
                .stream()
                .map(row -> CiudadVisitadaDTO.builder()
                        .idCiudad((Long) row[0])
                        .nombre((String) row[1])
                        .pais((String) row[2])
                        .cantidadVisitas((Long) row[3])
                        .build()
                ).toList();
    }

    //CIUDADES

    @Transactional(readOnly = true)
    public List<CiudadResponseDTO> buscarCiudadPorNombre(String nombre) {
        return ciudadRepository.findByNombreContainingIgnoreCase(nombre)
                .stream()
                .map(DestinoMapper::toCiudadDTO)
                .toList();
    }

    public Destino obtenerDestinoOExcepcion(Long id) {
        return destinoRepository.findById(id)
                .orElseThrow(()->new ClienteNotFoundException(id));
    }

    public Ciudad obtenerCiudadOExcepcion(Long id) {
        return ciudadRepository.findById(id)
                .orElseThrow(()->new CiudadNotFoundException(id));
    }
}
