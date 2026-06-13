package com.koraiken.crm.service;


import com.koraiken.crm.dto.Hotel.HotelCreateDTO;
import com.koraiken.crm.dto.Hotel.HotelResponseDTO;
import com.koraiken.crm.dto.Hotel.HotelUpdateDTO;
import com.koraiken.crm.dto.Hotel.HotelVisitadoDTO;
import com.koraiken.crm.exception.UserMailNotFoundException;
import com.koraiken.crm.mapper.ClienteMapper;
import com.koraiken.crm.mapper.HotelMapper;
import com.koraiken.crm.model.Destino;
import com.koraiken.crm.model.Hotel;
import com.koraiken.crm.model.Usuario;
import com.koraiken.crm.repository.IHotelRepository;
import com.koraiken.crm.repository.IUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class HotelService {
    private final IHotelRepository hotelRepository;
    private final AuthContextService authContextService;

    @Transactional
    public Hotel resolverHotel(Long idHotel, HotelCreateDTO dto) {
        if(idHotel != null) {
            return obtenerOExcepcion(idHotel);
        }
        if (dto != null && dto.getNombre() != null && !dto.getNombre().isBlank()) {
            return obteneroCrear(dto);
        }
        return null;
    }

    @Transactional
    public Hotel obteneroCrear(HotelCreateDTO dto) {
        String nombreNormalizado = normalizar(dto.getNombre());
        String direccionNormalizada = dto.getDireccion() != null
                ? normalizar(dto.getDireccion())
                : "";

        return hotelRepository
                .findByNombreIgnoreCaseAndDireccion(nombreNormalizado, direccionNormalizada)
                .orElseGet(() -> {
                    Hotel nuevo = new Hotel();
                    nuevo.setDireccion(direccionNormalizada);
                    nuevo.setNombre(nombreNormalizado);
                    return hotelRepository.save(nuevo);
                });
    }

    //capaz tendria que tener un hotelresponsedto
    @Transactional
    public HotelResponseDTO modificarHotel(Long idHotel, HotelUpdateDTO dto) {
        Hotel hotel = obtenerOExcepcion(idHotel);

        if(dto.getDireccion() != null ) hotel.setDireccion(dto.getDireccion());
        if(dto.getNombre() != null ) hotel.setNombre(dto.getNombre());

        Hotel hotelActualizado = hotelRepository.save(hotel);
        return HotelMapper.toDTO(hotelActualizado);
    }

    @Transactional
    public void eliminarHotel(Long idObservacion) {
        Hotel hotel = obtenerOExcepcion(idObservacion);
        hotelRepository.delete(hotel);
    }

    @Transactional (readOnly = true)
    public Hotel obtenerOExcepcion(Long idHotel) {
        return hotelRepository.findByIdHotel(idHotel).orElseThrow(() ->
                new RuntimeException("No existe un hotel con id: " + idHotel));
    }

    @Transactional (readOnly = true)
    public List<Hotel> buscarPorNombre(String nombre) {
        return hotelRepository.findByNombreContainsIgnoreCase(nombre);
    }

    private String normalizar(String termino) {
        if(termino == null) return "";
        String limpio = termino.trim().replaceAll("\\s+", " ");
        if(limpio.isEmpty()) return limpio;
        return Character.toUpperCase(limpio.charAt(0))
                + limpio.substring(1).toLowerCase();
    }
}
