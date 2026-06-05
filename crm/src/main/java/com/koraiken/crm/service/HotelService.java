package com.koraiken.crm.service;


import com.koraiken.crm.dto.Hotel.HotelCreateDTO;
import com.koraiken.crm.dto.Hotel.HotelResponseDTO;
import com.koraiken.crm.dto.Hotel.HotelUpdateDTO;
import com.koraiken.crm.mapper.ClienteMapper;
import com.koraiken.crm.mapper.HotelMapper;
import com.koraiken.crm.model.Destino;
import com.koraiken.crm.model.Hotel;
import com.koraiken.crm.repository.IHotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HotelService {
    private final DestinoService destinoService;
    private final IHotelRepository hotelRepository;
    //aca voy a crearlo pero desp queda el TODO de hacer el autocomplete de los que existen en el frontend
    @Transactional
    public Hotel resolverHotel(Long idHotel, HotelCreateDTO hotelCreateDTO) {
        if(idHotel != null) {
            return hotelRepository.findByIdHotel(idHotel)
                    .orElseThrow(() -> new RuntimeException("No existe el hotel con el id: " + idHotel));
        }
        if (hotelCreateDTO != null) {
            return crearHotel(hotelCreateDTO);
        }
        return null;
    }

    @Transactional
    public Hotel crearHotel(HotelCreateDTO dto) {
        Hotel hotel = new Hotel();
        hotel.setNombre(dto.getNombre());
        hotel.setDireccion(dto.getDireccion());
        return hotelRepository.save(hotel);
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
    public Hotel obtenerOExcepcion(Long idObservacion) {
        return hotelRepository.findByIdHotel(idObservacion).orElseThrow(() ->
                new RuntimeException("No existe un hotel con id: " + idObservacion));
    }

    @Transactional
    public void asociarDestino(Hotel hotel, Destino destino) {
        if (hotel != null) {
            hotel.setDestino(destino);
            hotelRepository.save(hotel);

        }
    }
}
