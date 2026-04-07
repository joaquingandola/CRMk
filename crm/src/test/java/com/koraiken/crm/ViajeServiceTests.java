package com.koraiken.crm;


import com.koraiken.crm.dto.Viaje.ViajeCreateDTO;
import com.koraiken.crm.dto.Viaje.ViajeResponseDTO;
import com.koraiken.crm.exception.ViajeNotFoundException;
import com.koraiken.crm.exception.ViajeTransicionInvalidaException;
import com.koraiken.crm.model.*;
import com.koraiken.crm.repository.IEstadoViajeRepository;
import com.koraiken.crm.repository.IViajeRepository;
import com.koraiken.crm.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class ViajeServiceTests {

    @Mock private IViajeRepository viajeRepository;
    @Mock private IEstadoViajeRepository estadoViajeRepository;
    @Mock private ClienteService clienteService;
    @Mock private AerolineaService aerolineaService;
    @Mock private AcompananteService acompananteService;
    @Mock private DestinoService destinoService;

    @InjectMocks private ViajeService viajeService;

    private Cliente cliente;
    private Aerolinea aerolinea;
    private Viaje viaje;
    private EstadoViaje estadoCotizado;
    private EstadoViaje estadoConfirmado;

    @BeforeEach
    void setUp() {
        cliente = new Cliente();
        cliente.setIdCliente(1L);
        cliente.setNombre("Juan");
        cliente.setApellido("Gomez");
        cliente.setActivo(true);
        cliente.setEnViaje(false);

        aerolinea = new Aerolinea();
        aerolinea.setIdAerolinea(1L);
        aerolinea.setAerolinea("Aerolineas Argentinas");

        viaje = new Viaje();
        viaje.setIdViaje(1L);
        viaje.setCliente(cliente);
        viaje.setAerolinea(aerolinea);
        viaje.setFechaInicioViaje(LocalDateTime.now().plusDays(5));
        viaje.setFechaFinViaje(LocalDateTime.now().plusDays(10));
        viaje.setPrecio(1500.0);
        viaje.setActivo(false);
        viaje.setDestinos(new ArrayList<>());
        viaje.setAcompanantes(new ArrayList<>());

        estadoCotizado = new EstadoViaje();
        estadoCotizado.setIdEstadoViaje(1L);
        estadoCotizado.setViaje(viaje);
        estadoCotizado.setEstadoConcretoViaje(EstadoConcretoViaje.COTIZADO);
        estadoCotizado.setFechaActualizacion(LocalDateTime.now());

        estadoConfirmado = new EstadoViaje();
        estadoConfirmado.setIdEstadoViaje(2L);
        estadoConfirmado.setViaje(viaje);
        estadoConfirmado.setEstadoConcretoViaje(EstadoConcretoViaje.CONFIRMADO);
        estadoConfirmado.setFechaActualizacion(LocalDateTime.now());
    }

    //crear viaje
    @Nested
    @DisplayName("crearViaje")
    class CrearViaje {
        @Test
        @DisplayName("crea el viaje con estado cotizado inicial")
        void dadoUnDTOValido_cuandoCrearViaje_entoncesEstadoInicialEsCotizado() {
            ViajeCreateDTO dto = new ViajeCreateDTO();
            dto.setIdCliente(1L);
            dto.setIdAerolinea(1L);
            dto.setFechaInicioViaje(LocalDateTime.now().plusDays(5));
            dto.setFechaFinViaje(LocalDateTime.now().plusDays(10));
            dto.setPrecio(1500.0);

            when(clienteService.obtenerClienteOExcepcion(1L)).thenReturn(cliente);
            when(aerolineaService.obtenerAerolineaOExcepcion(1L)).thenReturn(aerolinea);
            when(viajeRepository.save(any())).thenReturn(viaje);
            when(estadoViajeRepository.save(any())).thenReturn(estadoCotizado);

            ViajeResponseDTO resultado = viajeService.crearViaje(dto);

            assertThat(resultado).isNotNull();
            assertThat(resultado.getEstadoActual().getEstadoConcretoViaje())
                    .isEqualTo(EstadoConcretoViaje.COTIZADO);
            verify(estadoViajeRepository).save(any(EstadoViaje.class));
        }

        @Test
        @DisplayName("Lanza excepcion si fechaInicio es posterior a fechaFin")
        void dadoFechasInvertidas_cuandoCrearViaje_entoncesLanzaExcepcion() {
            ViajeCreateDTO dto = new ViajeCreateDTO();
            dto.setIdCliente(1L);
            dto.setIdAerolinea(1L);
            dto.setFechaInicioViaje(LocalDateTime.now().plusDays(10));
            dto.setFechaFinViaje(LocalDateTime.now().plusDays(5));

            assertThatThrownBy(() -> viajeService.crearViaje(dto))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("fecha");

            verify(viajeRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("buscarporid")
    class BuscarPorId{
        @Test
        @DisplayName("devuelve el viaje con su estado actual")
        void dadoUnIdExistente_cuandoBuscarPorId_entoncesDevuelveDTO(){
            when(viajeRepository.findById(1L)).thenReturn(Optional.of(viaje));
            when(estadoViajeRepository.findEstadoActual(1L))
                    .thenReturn(Optional.of(estadoCotizado));

            ViajeResponseDTO resultado = viajeService.buscarPorId(1L);

            assertThat(resultado.getIdViaje()).isEqualTo(1L);
            assertThat(resultado.getEstadoActual().getEstadoConcretoViaje())
                    .isEqualTo(EstadoConcretoViaje.COTIZADO);
        }

        @Test
        @DisplayName("lanza excepcion si el viaje no existe")
        void dadoUnIdInexistente_cuandoBuscarPorId_entoncesLanzaExcepcion() {
            when(viajeRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(()->viajeService.buscarPorId(99L))
                    .isInstanceOf(ViajeNotFoundException.class)
                    .hasMessageContaining("99");
        }
    }

    @Nested
    @DisplayName("cambiar ESTADO")
    class CambiarEstado {

        @Test
        @DisplayName("transición válida COTIZADO → CONFIRMADO activa el viaje")
        void dadoEstadoCotizado_cuandoCambiarAConfirmado_entoncesViajeActivo() {
            when(viajeRepository.findById(1L)).thenReturn(Optional.of(viaje));
            when(estadoViajeRepository.findEstadoActual(1L))
                    .thenReturn(Optional.of(estadoCotizado));
            when(estadoViajeRepository.save(any())).thenReturn(estadoConfirmado);
            when(viajeRepository.save(any())).thenReturn(viaje);

            ViajeResponseDTO resultado = viajeService.cambiarEstado(1L, EstadoConcretoViaje.CONFIRMADO);

            // El viaje debe quedar activo
            assertThat(viaje.getActivo()).isTrue();
            // El cliente debe quedar marcado como en viaje
            assertThat(cliente.getEnViaje()).isTrue();
        }
        @Test
        @DisplayName("transición inválida PAGADO → CONFIRMADO lanza excepción")
        void dadoEstadoPagado_cuandoCambiarAConfirmado_entoncesLanzaExcepcion() {
            EstadoViaje estadoPagado = new EstadoViaje();
            estadoPagado.setEstadoConcretoViaje(EstadoConcretoViaje.PAGADO);
            estadoPagado.setFechaActualizacion(LocalDateTime.now());

            when(viajeRepository.findById(1L)).thenReturn(Optional.of(viaje));
            when(estadoViajeRepository.findEstadoActual(1L))
                    .thenReturn(Optional.of(estadoPagado));

            assertThatThrownBy(() ->
                    viajeService.cambiarEstado(1L, EstadoConcretoViaje.CONFIRMADO))
                    .isInstanceOf(ViajeTransicionInvalidaException.class)
                    .hasMessageContaining("PAGADO")
                    .hasMessageContaining("CONFIRMADO");
        }

        @Test
        @DisplayName("transición CONFIRMADO → CANCELADO desactiva el viaje y al cliente")
        void dadoEstadoConfirmado_cuandoCancelar_entoncesViajeYClienteInactivos() {
            viaje.setActivo(true);
            cliente.setEnViaje(true);

            when(viajeRepository.findById(1L)).thenReturn(Optional.of(viaje));
            when(estadoViajeRepository.findEstadoActual(1L))
                    .thenReturn(Optional.of(estadoConfirmado));
            when(estadoViajeRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
            when(viajeRepository.save(any())).thenReturn(viaje);

            viajeService.cambiarEstado(1L, EstadoConcretoViaje.CANCELADO);

            assertThat(viaje.getActivo()).isFalse();
            assertThat(cliente.getEnViaje()).isFalse();
        }

        @Test
        @DisplayName("CANCELADO es estado terminal — no se puede salir")
        void dadoEstadoCancelado_cuandoCambiarACualquierEstado_entoncesLanzaExcepcion() {
            EstadoViaje estadoCancelado = new EstadoViaje();
            estadoCancelado.setEstadoConcretoViaje(EstadoConcretoViaje.CANCELADO);
            estadoCancelado.setFechaActualizacion(LocalDateTime.now());

            when(viajeRepository.findById(1L)).thenReturn(Optional.of(viaje));
            when(estadoViajeRepository.findEstadoActual(1L))
                    .thenReturn(Optional.of(estadoCancelado));

            // Ninguna transición desde CANCELADO es válida
            for (EstadoConcretoViaje estado : EstadoConcretoViaje.values()) {
                assertThatThrownBy(() -> viajeService.cambiarEstado(1L, estado))
                        .isInstanceOf(ViajeTransicionInvalidaException.class);
            }
        }
    }

    // ----------ACOMPANANTES ------------------
    @Nested
    @DisplayName("acompanantes")
    class Acompanantes {
        @Test
        @DisplayName("lanza excepcion si el acompanante ya esta en el viaje")
        void dadoAcompananteYaAsociado_cuandoAgregar_entoncesLanzaExcepcion() {
            Acompanante acompanante = new Acompanante();
            acompanante.setIdAcompanante(1L);
            viaje.getAcompanantes().add(acompanante);

            when(viajeRepository.findById(1L)).thenReturn(Optional.of(viaje));
            when(acompananteService.obtenerAcompananteOExcepcion(1L)).thenReturn(acompanante);

            assertThatThrownBy(()->viajeService.agregarAcompaniantes(1L, 1L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("ya esta asociado");
        }

        @Test
        @DisplayName("quita el acompanante correctamente")
        void dadoAcompananteAsociado_cuandoQuitar_entoncesSeElimina() {
            Acompanante acompanante = new Acompanante();
            acompanante.setIdAcompanante(1L);
            viaje.getAcompanantes().add(acompanante);

            when(viajeRepository.findById(1L)).thenReturn(Optional.of(viaje));
            when(estadoViajeRepository.findEstadoActual(1L))
                    .thenReturn(Optional.of(estadoCotizado));
            when(viajeRepository.save(any())).thenReturn(viaje);

            viajeService.quitarAcompanante(1L, 1L);
            assertThat(viaje.getAcompanantes()).isEmpty();
        }
    }
}
