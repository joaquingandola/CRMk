package com.koraiken.crm.service;

import com.koraiken.crm.dto.Destino.DestinoCreateDTO;
import com.koraiken.crm.dto.EstadoViaje.EstadoViajeResponseDTO;
import com.koraiken.crm.dto.Viaje.ViajeCreateDTO;
import com.koraiken.crm.dto.Viaje.ViajeResponseDTO;
import com.koraiken.crm.dto.Viaje.ViajeUpdateDTO;
import com.koraiken.crm.exception.ViajeNotFoundException;
import com.koraiken.crm.exception.ViajeTransicionInvalidaException;
import com.koraiken.crm.mapper.ViajeMapper;
import com.koraiken.crm.model.*;
import com.koraiken.crm.repository.IEstadoViajeRepository;
import com.koraiken.crm.repository.IViajeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ViajeService {

    private final IViajeRepository viajeRepository;
    private final IEstadoViajeRepository estadoViajeRepository;
    private final ClienteService clienteService;
    private final AerolineaService aerolineaService;
    private final AcompananteService acompananteService;
    private final DestinoService destinoService;

    //crear
    @Transactional
    public ViajeResponseDTO crearViaje(ViajeCreateDTO dto) {

        if(!dto.getFechaInicioViaje().isBefore(dto.getFechaFinViaje())) {
            throw new RuntimeException("La fecha de salida es anterior a la de llegada");
        }

        Cliente cliente = clienteService.obtenerClienteOExcepcion(dto.getIdCliente());
        Aerolinea aerolinea = aerolineaService.obtenerAerolineaOExcepcion(dto.getIdAerolinea());

        Viaje viaje = new Viaje();
        viaje.setCliente(cliente);
        viaje.setAerolinea(aerolinea);
        viaje.setFechaFinViaje(dto.getFechaFinViaje());
        viaje.setFechaInicioViaje(dto.getFechaInicioViaje());
        viaje.setPrecio(dto.getPrecio());

        if(dto.getIdAcompanantes() != null) {
            List<Acompanante> acompanantes = dto.getIdAcompanantes()
                    .stream()
                    .map(acompananteService::obtenerAcompananteOExcepcion)
                    .toList();
            viaje.getAcompanantes().addAll(acompanantes);
        }

        Viaje guardado = viajeRepository.save(viaje);


        // crear y asociar destinos
        if(dto.getDestinos() != null) {
            for(DestinoCreateDTO destinoDTO : dto.getDestinos()) {

                // Validar fecha de cada escala dentro del rango del viaje
                if(destinoDTO.getFechaLlegada().isBefore(dto.getFechaInicioViaje()) ||
                destinoDTO.getFechaLlegada().isAfter(dto.getFechaFinViaje())    ||
                destinoDTO.getFechaSalida().isAfter(dto.getFechaFinViaje()) ||
                destinoDTO.getFechaSalida().isBefore(dto.getFechaInicioViaje())) {
                    throw new RuntimeException(
                            "Las fechas del destino deben estar dentro del rango del viaje"
                    );
                }

                Ciudad ciudad = destinoService.obtenerCiudadOExcepcion(destinoDTO.getIdCiudad());

                Destino destino = new Destino();
                destino.setViaje(guardado);
                destino.setCiudad(ciudad);
                destino.setFechaSalida(destinoDTO.getFechaSalida());
                destino.setFechaLlegada(destinoDTO.getFechaLlegada());
                guardado.getDestinos().add(destino);
            }
        }

        EstadoViaje estadoInicial = new EstadoViaje();
        estadoInicial.setViaje(guardado);
        estadoInicial.setEstadoConcretoViaje(EstadoConcretoViaje.COTIZADO);
        estadoInicial.setFechaActualizacion(LocalDateTime.now());
        estadoViajeRepository.save(estadoInicial);

        //deberia marcar cliente como en viaje si es que el viaje esta activo
        //pero esto lo hago al confirmar el viaje mejor, tiene mas sentido
        return ViajeMapper.toDTO(guardado, estadoInicial);
    }

    //buscar
    @Transactional(readOnly = true)
    public ViajeResponseDTO buscarPorId(Long id) {
        Viaje viaje = obtenerViajeOExcepcion(id);
        EstadoViaje estadoViaje = estadoViajeRepository
                .findEstadoActual(id)
                .orElse(null);
        return ViajeMapper.toDTO(viaje, estadoViaje);
    }

    @Transactional(readOnly = true)
    public List<ViajeResponseDTO> listarPorCliente(Long idCliente) {
        return viajeRepository.findByClienteIdCliente(idCliente)
                .stream()
                .map(v->ViajeMapper.toDTO(v,
                        estadoViajeRepository.findEstadoActual(v.getIdViaje()).orElse(null)
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ViajeResponseDTO> listarPorRangoFechas(LocalDateTime desde, LocalDateTime hasta) {
        return viajeRepository.findByFechaInicioViajeBetween(desde, hasta)
                .stream()
                .map(v-> ViajeMapper.toDTO(v,
                            estadoViajeRepository.findEstadoActual(v.getIdViaje()).orElse(null)
                        ))
                .toList();
    }

    //actualizar
    @Transactional
    public ViajeResponseDTO actualizarViaje(Long id, ViajeUpdateDTO dto) {
        Viaje viaje = obtenerViajeOExcepcion(id);

        if(dto.getFechaInicioViaje() != null) viaje.setFechaInicioViaje(dto.getFechaInicioViaje());
        if(dto.getFechaFinViaje() != null) viaje.setFechaFinViaje(dto.getFechaFinViaje());
        if(dto.getPrecio() != null) viaje.setPrecio(dto.getPrecio());

        if(dto.getIdAerolinea() != null) {
            viaje.setAerolinea(aerolineaService.obtenerAerolineaOExcepcion(dto.getIdAerolinea()));
        }

        EstadoViaje estadoActual = estadoViajeRepository
                .findEstadoActual(id).orElse(null);

        return ViajeMapper.toDTO(viajeRepository.save(viaje), estadoActual);
    }

    //gestionar cambio esatado
    @Transactional
    public ViajeResponseDTO cambiarEstado(Long id, EstadoConcretoViaje nuevoEstado) {
        Viaje viaje = obtenerViajeOExcepcion(id);

        EstadoViaje estadoActual = estadoViajeRepository
                .findEstadoActual(id)
                .orElseThrow(() ->new RuntimeException("El viaje no tiene estado registrado."));

        validarTransicion(estadoActual.getEstadoConcretoViaje(), nuevoEstado);

        //registro del nuevo estado por una cuestion de historial
        EstadoViaje nuevoEstadoViaje = new EstadoViaje();
        nuevoEstadoViaje.setViaje(viaje);
        nuevoEstadoViaje.setEstadoConcretoViaje(nuevoEstado);
        nuevoEstadoViaje.setFechaActualizacion(LocalDateTime.now());
        estadoViajeRepository.save(nuevoEstadoViaje);

        if(nuevoEstado == EstadoConcretoViaje.CONFIRMADO) {
            viaje.setActivo(true);
            viaje.getCliente().setEnViaje(true);
            viajeRepository.save(viaje);
        }

        if(nuevoEstado == EstadoConcretoViaje.CANCELADO) {
            viaje.setActivo(false);
            viaje.getCliente().setEnViaje(false);
            viajeRepository.save(viaje);
        }

        return ViajeMapper.toDTO(viaje, nuevoEstadoViaje);
    }

    @Transactional(readOnly = true)
    public List<EstadoViajeResponseDTO> historialEstados(Long id) {
        obtenerViajeOExcepcion(id);
        return estadoViajeRepository
                .findByViajeIdViajeOrderByFechaActualizacionDesc(id)
                .stream()
                .map(e-> EstadoViajeResponseDTO.builder()
                        .idEstadoViaje(e.getIdEstadoViaje())
                        .estadoConcretoViaje(e.getEstadoConcretoViaje())
                        .fechaActualizacion(e.getFechaActualizacion())
                        .build()
                )
                .toList();
    }

    //gestion acompanantes
    @Transactional
    public ViajeResponseDTO agregarAcompaniantes(Long idViaje, Long idAcompanante) {
        Viaje viaje = obtenerViajeOExcepcion(idViaje);
        Acompanante acompanante = acompananteService.obtenerAcompananteOExcepcion(idAcompanante);

        boolean yaAsociado = viaje.getAcompanantes()
                .stream()
                .anyMatch(a -> a.getIdAcompanante().equals(idAcompanante));

        if(yaAsociado) {
            throw new RuntimeException("El acompanante ya esta asociado a este viaje.");
        }

        viaje.getAcompanantes().add(acompanante);
        EstadoViaje estadoActual = estadoViajeRepository.findEstadoActual(idViaje).orElse(null);
        return ViajeMapper.toDTO(viajeRepository.save(viaje), estadoActual);
    }

    @Transactional
    public ViajeResponseDTO quitarAcompanante(Long idViaje, Long idAcompanante) {
        Viaje viaje = obtenerViajeOExcepcion(idViaje);

        viaje.getAcompanantes()
                .removeIf(a -> a.getIdAcompanante().equals(idAcompanante));

        EstadoViaje estadoActual = estadoViajeRepository.findEstadoActual(idViaje).orElse(null);
        return ViajeMapper.toDTO(viajeRepository.save(viaje), estadoActual);
    }

    //listar todos
    @Transactional(readOnly = true)
    public List<ViajeResponseDTO> listarTodos() {
        return viajeRepository.findAll()
                .stream()
                .map(v -> ViajeMapper.toDTO(v,
                        estadoViajeRepository.findEstadoActual(v.getIdViaje()).orElse(null)
                ))
                .toList();
    }


    //metodos internos
    public Viaje obtenerViajeOExcepcion(Long id) {
        return viajeRepository.findById(id)
                .orElseThrow(()-> new ViajeNotFoundException(id));
    }

    private void validarTransicion(EstadoConcretoViaje actual, EstadoConcretoViaje nuevo) {
        //COTIZADO -> CONFIRMADO, CANCELADO
        //CONFIRMADO->PAGADO, CANCELADO
        //PAGADO Y CANCELADO estados terminales- no se puede salir de ellos
        boolean valida = switch (actual) {
            case COTIZADO -> nuevo == EstadoConcretoViaje.CONFIRMADO
                        || nuevo == EstadoConcretoViaje.CANCELADO;
            case CONFIRMADO -> nuevo == EstadoConcretoViaje.PAGADO
                        || nuevo == EstadoConcretoViaje.CANCELADO;
            case PAGADO, CANCELADO -> false;
        };

        if(!valida) {
            throw new ViajeTransicionInvalidaException(actual.name(), nuevo.name());
        }
    }
}
