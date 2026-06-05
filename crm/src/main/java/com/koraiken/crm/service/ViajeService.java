package com.koraiken.crm.service;

import com.koraiken.crm.dto.Cliente.ClienteResponseDTO;
import com.koraiken.crm.dto.Destino.DestinoCreateDTO;
import com.koraiken.crm.dto.EstadoViaje.EstadoViajeResponseDTO;
import com.koraiken.crm.dto.Viaje.ViajeCreateDTO;
import com.koraiken.crm.dto.Viaje.ViajeResponseDTO;
import com.koraiken.crm.dto.Viaje.ViajeUpdateDTO;
import com.koraiken.crm.exception.*;
import com.koraiken.crm.mapper.ClienteMapper;
import com.koraiken.crm.mapper.ViajeMapper;
import com.koraiken.crm.model.*;
import com.koraiken.crm.repository.IDestinoRepository;
import com.koraiken.crm.repository.IEstadoViajeRepository;
import com.koraiken.crm.repository.IUsuarioRepository;
import com.koraiken.crm.repository.IViajeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
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
    private final HotelService hotelService;
    private final IUsuarioRepository usuarioRepository;
    private final IDestinoRepository destinoRepository;

    private Usuario obtenerUsuarioAuth() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UserMailNotFoundException(email));
    }

    private void verificarExistenciaViajeMismaFechas(ViajeCreateDTO dto) {
        boolean existeViajeSuperpuesto = viajeRepository.existeViajeSuperpuesto(
                dto.getIdCliente(),
                dto.getFechaInicioViaje(),
                dto.getFechaFinViaje());
        if (existeViajeSuperpuesto) {
            throw new ViajeSuperpuestoException();
        }
    }

    @Transactional
    public ViajeResponseDTO crearViaje(ViajeCreateDTO dto) {
        verificarExistenciaViajeMismaFechas(dto);
        if(!dto.getFechaInicioViaje().isBefore(dto.getFechaFinViaje())) {
            throw new RuntimeException("La fecha de inicio del viaje debe ser anterior a la fecha del fin del viaje");
        }

        Cliente cliente = clienteService.obtenerClienteOExcepcion(dto.getIdCliente());
        Aerolinea aerolinea = aerolineaService.obtenerAerolineaOExcepcion(dto.getIdAerolinea());

        Usuario usuario = obtenerUsuarioAuth();
        if(!usuario.getTipoRol().isAdmin() &&
            !cliente.getAgente().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new AccessDeniedException("No podes crear un viaje para un cliente de otro agente");
        }

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
            validarFechasDestinos(dto);
            guardarDestinos(dto, guardado);
        }


        EstadoViaje estadoInicial = new EstadoViaje();
        estadoInicial.setViaje(guardado);
        estadoInicial.setEstadoConcretoViaje(EstadoConcretoViaje.COTIZADO);
        estadoInicial.setFechaActualizacion(LocalDateTime.now());
        estadoViajeRepository.save(estadoInicial);

        return ViajeMapper.toDTO(guardado, estadoInicial);
    }

    //buscar
    @Transactional(readOnly = true)
    public ViajeResponseDTO buscarPorId(Long id) {
        Viaje viaje = obtenerViajeOExcepcion(id);
        validarOwnership(viaje, obtenerUsuarioAuth());

        EstadoViaje estadoViaje = estadoViajeRepository
                .findEstadoActual(id)
                .orElse(null);
        return ViajeMapper.toDTO(viaje, estadoViaje);
    }

    //viajes de un cliente
    @Transactional(readOnly = true)
    public List<ViajeResponseDTO> listarPorCliente(Long idCliente) {
        Usuario usuario = obtenerUsuarioAuth();

        if(!usuario.getTipoRol().isAdmin()) {
            Cliente cliente = clienteService.obtenerClienteOExcepcion(idCliente);
            if(!cliente.getAgente().getIdUsuario().equals(usuario.getIdUsuario())) {
                throw new AccessDeniedException("No tenes permisos para ver los viajes del cliente");
            }
        }
        return viajeRepository.findByClienteIdCliente(idCliente)
                .stream()
                .map(v -> ViajeMapper.toDTO(v,
                        estadoViajeRepository.findEstadoActual(v.getIdViaje()).orElse(null)
                )).toList();
    }

    @Transactional(readOnly = true)
    public List<ViajeResponseDTO> listarPorRangoFechas(LocalDate desde, LocalDate hasta) {
        Usuario usuario = obtenerUsuarioAuth();

        List<Viaje> viajes = usuario.getTipoRol().isAdmin()
                ? viajeRepository.findByFechaInicioViajeBetween(desde, hasta)
                : viajeRepository.findByFechaInicioViajeBetweenAndClienteAgenteIdUsuario(
                        desde, hasta, usuario.getIdUsuario()
        );

        return viajes.stream()
                .map(v -> ViajeMapper.toDTO(v,
                        estadoViajeRepository.findEstadoActual(v.getIdViaje()).orElse(null)
                )).toList();
    }

    //actualizar
    @Transactional
    public ViajeResponseDTO actualizarViaje(Long id, ViajeUpdateDTO dto) {
        Viaje viaje = obtenerViajeOExcepcion(id);
        validarOwnership(viaje, obtenerUsuarioAuth());

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
        validarOwnership(viaje, obtenerUsuarioAuth());

        EstadoViaje estadoActual = estadoViajeRepository
                .findEstadoActual(id)
                .orElseThrow(() ->new RuntimeException("El viaje no tiene estado registrado."));

        validarTransicion(estadoActual.getEstadoConcretoViaje(), nuevoEstado);

        //registro del nuevo estado por una cuestion de historial
        EstadoViaje nuevoEstadoViaje = registrarNuevoEstado(viaje, nuevoEstado);
        aplicarEfectosEstado(viaje, nuevoEstado);

        viajeRepository.save(viaje);
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
        validarOwnership(viaje, obtenerUsuarioAuth());
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
        validarOwnership(viaje, obtenerUsuarioAuth());

        viaje.getAcompanantes()
                .removeIf(a -> a.getIdAcompanante().equals(idAcompanante));

        EstadoViaje estadoActual = estadoViajeRepository.findEstadoActual(idViaje).orElse(null);
        return ViajeMapper.toDTO(viajeRepository.save(viaje), estadoActual);
    }

    //listar todos
    @Transactional(readOnly = true)
    public List<ViajeResponseDTO> listarTodos() {
        Usuario usuario = obtenerUsuarioAuth();
        List<Viaje> viajes = usuario.getTipoRol().isAdmin()
                ? viajeRepository.findAll()
                : viajeRepository.findByClienteAgenteIdUsuario(usuario.getIdUsuario());

        return viajes.stream()
                .map(v -> ViajeMapper.toDTO(v,
                        estadoViajeRepository.findEstadoActual(v.getIdViaje()).orElse(null)
                )).toList();
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

    private EstadoViaje registrarNuevoEstado(Viaje viaje, EstadoConcretoViaje nuevoEstado) {
        EstadoViaje nuevoEstadoViaje = new EstadoViaje();

        nuevoEstadoViaje.setViaje(viaje);
        nuevoEstadoViaje.setEstadoConcretoViaje(nuevoEstado);
        nuevoEstadoViaje.setFechaActualizacion(LocalDateTime.now());
        return estadoViajeRepository.save(nuevoEstadoViaje);
    }

    private void aplicarEfectosEstado(Viaje viaje, EstadoConcretoViaje nuevoEstado) {
        if(nuevoEstado == EstadoConcretoViaje.CONFIRMADO) {
            viaje.setActivo(true);
        }

        if(nuevoEstado == EstadoConcretoViaje.CANCELADO) {
            viaje.setActivo(false);
        }
    }

    private void validarFechasNoPisadas(List<DestinoCreateDTO> destinos) {
        for (int i = 0; i < destinos.size(); i++) {
            for (int j = i + 1; j < destinos.size();j++) {
                LocalDate llegadaA = destinos.get(i).getFechaLlegada();
                LocalDate llegadaB = destinos.get(j).getFechaLlegada();
                LocalDate salidaA = destinos.get(i).getFechaSalida();
                LocalDate salidaB = destinos.get(j).getFechaSalida();

                if(llegadaA.isBefore(salidaB) && llegadaB.isBefore(salidaA)) {
                    throw new DestinoFechasSolapadasException(
                            "Las fechas de dos destinos estan solapadas"
                    );
                }
            }
        }
    }

    private void validarFechasDestinos(ViajeCreateDTO dto) {
        List<DestinoCreateDTO> destinos = dto.getDestinos();
        for(DestinoCreateDTO destinoDTO : destinos) {
            if(destinoDTO.getFechaLlegada().isBefore(dto.getFechaInicioViaje()) ||
                    destinoDTO.getFechaLlegada().isAfter(dto.getFechaFinViaje())    ||
                    destinoDTO.getFechaSalida().isAfter(dto.getFechaFinViaje()) ||
                    destinoDTO.getFechaSalida().isBefore(dto.getFechaInicioViaje())) {
                throw new DestinoFechaInvalidaException();
            }
            if(!destinoDTO.getFechaLlegada().isBefore(destinoDTO.getFechaSalida())) {
                throw new DestinoFechaInvalidaException();
            }
        }
        validarFechasNoPisadas(destinos);
    }

    private void guardarDestinos(ViajeCreateDTO viajeDTO, Viaje viaje) {
        for (DestinoCreateDTO destinoDTO : viajeDTO.getDestinos()) {
            Ciudad ciudad = destinoService.obtenerCiudadOExcepcion(destinoDTO.getIdCiudad());
            Hotel hotel = hotelService.resolverHotel(destinoDTO.getIdHotel(), destinoDTO.getHotel());

            Destino destino = new Destino();
            destino.setViaje(viaje);
            destino.setCiudad(ciudad);
            destino.setFechaLlegada(destinoDTO.getFechaLlegada());
            destino.setFechaSalida(destinoDTO.getFechaSalida());
            Destino destinoGuardado = destinoRepository.save(destino);
            hotelService.asociarDestino(hotel, destinoGuardado);

            viaje.getDestinos().add(destinoRepository.save(destino));
        }
    }

    private void validarOwnership(Viaje viaje, Usuario usuario) {
        if(usuario.getTipoRol().isAdmin()) return;
        Long agenteCliente = viaje.getCliente().getAgente().getIdUsuario();
        if(!agenteCliente.equals(usuario.getIdUsuario())) {
            throw new AccessDeniedException("No tenes permisos para modificar al cliente");
        }
    }
}
