package com.koraiken.crm;


import com.koraiken.crm.dto.Cliente.ClienteCreateDTO;
import com.koraiken.crm.dto.Cliente.ClienteResponseDTO;
import com.koraiken.crm.dto.Cliente.ClienteUpdateDTO;
import com.koraiken.crm.dto.Contacto.ContactoInputDTO;
import com.koraiken.crm.exception.ClienteConViajesActivosException;
import com.koraiken.crm.exception.ClienteExisteException;
import com.koraiken.crm.exception.ClienteNotFoundException;
import com.koraiken.crm.model.Cliente;
import com.koraiken.crm.model.Medio;
import com.koraiken.crm.repository.IClienteRepository;
import com.koraiken.crm.repository.IContactoRepository;
import com.koraiken.crm.repository.IViajeRepository;
import com.koraiken.crm.service.ClienteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTests {
    @Mock private IClienteRepository clienteRepository;
    @Mock private IViajeRepository viajeRepository;
    @Mock private IContactoRepository contactoRepository;

    @InjectMocks private ClienteService clienteService;

    //cliente base para reutilizar
    private Cliente clienteExistente;
    private ClienteCreateDTO dtoCrear;

    @BeforeEach
    void setUp() {
        clienteExistente = new Cliente();
        clienteExistente.setIdCliente(1L);
        clienteExistente.setNombre("Juan");
        clienteExistente.setApellido("Gomez");
        clienteExistente.setDni(12345678);
        clienteExistente.setActivo(true);
        clienteExistente.setEnViaje(true);

        dtoCrear = new ClienteCreateDTO();
        dtoCrear.setNombre("Maria");
        dtoCrear.setApellido("Alvarez");
        dtoCrear.setDni(1123124);
        dtoCrear.setFechaNacimiento(LocalDate.of(1990, 5, 15));
    }

    @Nested
    @DisplayName("crearCliente")
    class CrearCliente {
        @Test
        @DisplayName("crea correctamente el cliente cuando el dni no existe")
        void dadoUnDNINuevo_cuandoCrearCliente_entoncesGuardaYDevuelveDTO() {
            //arrange
            when(clienteRepository.existsByDni(dtoCrear.getDni())).thenReturn(false);
            when(clienteRepository.save(any(Cliente.class))).thenAnswer(inv -> {
               Cliente c = inv.getArgument(0);
               c.setIdCliente(2L);
               return c;
            });

            //Act
            ClienteResponseDTO resultado = clienteService.crearCliente(dtoCrear);
            //Assert
            assertThat(resultado).isNotNull();
            assertThat(resultado.getNombre()).isEqualTo("Maria");
            assertThat(resultado.getDni()).isEqualTo(1123124);
            verify(clienteRepository).save(any(Cliente.class));
        }

        @Test
        @DisplayName("lanza excepcion si ya existe el DNI")
        void dadoUnDNIExistente_cuandoCrearCliente_entoncesLanzaExcepcion() {
            //arrange
            when(clienteRepository.existsByDni(dtoCrear.getDni())).thenReturn(true);

            //act&assert
            assertThatThrownBy(() -> clienteService.crearCliente(dtoCrear))
                    .isInstanceOf(ClienteExisteException.class)
                    .hasMessageContaining("1123124");

            //verifico que no se intento guardar
            verify(clienteRepository, never()).save(any());
        }

        @Test
        @DisplayName("lanza excepción cuando un contacto ya existe")
        void dadoUnContactoDuplicado_cuandoCrearCliente_entoncesLanzaExcepcion() {
            //arrange
            ContactoInputDTO contacto = new ContactoInputDTO();
            contacto.setDetalle("juan@mail.com");
            contacto.setMedio(Medio.MAIL);
            dtoCrear.setContactos(List.of(contacto));

            when(clienteRepository.existsByDni(any())).thenReturn(false);
            when(contactoRepository.existsByDetalle("juan@mail.com")).thenReturn(true);

            //act&Assert
            assertThatThrownBy(() -> clienteService.crearCliente(dtoCrear))
                    .isInstanceOf(ClienteExisteException.class)
                    .hasMessageContaining("juan@mail.com");

            verify(clienteRepository, never()).save(any());
        }

    }

    @Nested
    @DisplayName("buscar por id")
    class BuscarPorId {

        @Test
        @DisplayName("devuelve el DTO cuando el cliente existe")
        void dadoUnIdExistente_cuandoBuscarPorId_entoncesDevuelveDTO() {
            when(clienteRepository.findByIdCliente(1L))
                    .thenReturn(Optional.of(clienteExistente));

            ClienteResponseDTO resultado = clienteService.buscarPorId(1L);

            assertThat(resultado.getIdCliente()).isEqualTo(1L);
            assertThat(resultado.getNombre()).isEqualTo("Juan");
        }

        @Test
        @DisplayName("lanza excepción cuando el cliente no existe")
        void dadoUnIdInexistente_cuandoBuscarPorId_entoncesLanzaExcepcion(){
            when(clienteRepository.findByIdCliente(99L))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> clienteService.buscarPorId(99L))
                    .isInstanceOf(ClienteNotFoundException.class)
                    .hasMessageContaining("99");
        }
    }

    @Nested
    @DisplayName("listarActivos")
    class ListarActivos {

        @Test
        @DisplayName("devuelve solo clientes activos")
        void cuandoListarActivos_entoncesDevuelveSoloActivos() {
            when(clienteRepository.findByActivoTrue())
                    .thenReturn(List.of(clienteExistente));

            List<ClienteResponseDTO> resultado = clienteService.listarActivos();

            assertThat(resultado).hasSize(1);
            assertThat(resultado.get(0).getActivo()).isTrue();
        }

        @Test
        @DisplayName("devuelve lista vacía si no hay clientes activos")
        void cuandoNoHayActivos_entoncesDevuelveListaVacia() {
            when(clienteRepository.findByActivoTrue()).thenReturn(List.of());

            List<ClienteResponseDTO> resultado = clienteService.listarActivos();

            assertThat(resultado).isEmpty();
        }
    }

    //actualizar
    @Nested
    @DisplayName("actualizarCliente")
    class ActualizarCliente{

        @Test
        @DisplayName("actualiza solo los campos enviados")
        void dadoCamposParciales_cuandoActualizar_entoncesSoloPisaEsos() {
            when(clienteRepository.findByIdCliente(1L))
                    .thenReturn(Optional.of(clienteExistente));
            when(clienteRepository.save(any())).thenAnswer(inv->inv.getArgument(0));

            ClienteUpdateDTO dto = new ClienteUpdateDTO();
            dto.setNombre("NuevoNombre");

            ClienteResponseDTO resultado = clienteService.actualizarCliente(1L, dto);

            assertThat(resultado.getNombre()).isEqualTo("NuevoNombre");
            assertThat(resultado.getApellido()).isEqualTo("Gomez");

        }
    }

    //dar de baja
    @Nested
    @DisplayName("dar de baja")
    class DarDeBaja {

        @Test
        @DisplayName("da de baja cuando no tiene viajes activos")
        void dadoClienteSinViajesActivos_cuandoDarDeBaja_entoncesSetActivoFalse() {
            when(clienteRepository.findByIdCliente(1L))
                    .thenReturn(Optional.of(clienteExistente));
            when(viajeRepository.existsByClienteIdClienteAndActivoTrue(1L))
                    .thenReturn(false);

            clienteService.darDeBaja(1L);

            assertThat(clienteExistente.getActivo()).isFalse();
            verify(clienteRepository).save(clienteExistente);
        }

        @Test
        @DisplayName("lanza excepcion cuando tiene viajes activos")
        void dadoClienteConViajesActivos_cuandoDarDeBaja_entoncesLanzaExcepcion() {
            when(clienteRepository.findByIdCliente(1L))
                    .thenReturn(Optional.of(clienteExistente));
            when(viajeRepository.existsByClienteIdClienteAndActivoTrue(1L))
                    .thenReturn(true);

            assertThatThrownBy(() -> clienteService.darDeBaja(1L))
                    .isInstanceOf(ClienteConViajesActivosException.class);
            // El cliente NO debe haberse guardado con activo=false
            verify(clienteRepository, never()).save(any());
        }
    }
}
