package com.koraiken.crm.service;


import com.koraiken.crm.dto.Hotel.HotelCreateDTO;
import com.koraiken.crm.model.Hotel;
import com.koraiken.crm.repository.IHotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final IHotelRepository hotelRepository;
    //aca voy a crearlo pero desp queda el TODO de hacer el autocomplete de los que existen en el frontend
    @Transactional
    public Hotel resolverHotel(Long idHotel, HotelCreateDTO hotelCreateDTO) {
        if(idHotel!= null) {
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

    @Transactional (readOnly = true)
    public Hotel obtenerOExcepcion(Long id) {
        return hotelRepository.findByIdHotel(id).orElseThrow(() ->
                new RuntimeException("No existe un hotel con id: " + id));
    }
}
