package com.koraiken.crm.service;

import com.koraiken.crm.dto.*;
import com.koraiken.crm.exception.ClienteConViajesActivosException;
import com.koraiken.crm.exception.ClienteExisteException;
import com.koraiken.crm.exception.ClienteNotFoundException;
import com.koraiken.crm.mapper.ClienteMapper;
import com.koraiken.crm.model.Cliente;
import com.koraiken.crm.model.Contacto;
import com.koraiken.crm.repository.IClienteRepository;
import com.koraiken.crm.repository.IContactoRepository;
import com.koraiken.crm.repository.IViajeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {
    private final IClienteRepository iClienteRepository;
    private final IViajeRepository iViajeRepository;
    private final IContactoRepository iContactoRepository;

    //CREAR//
    @Transactional
    public ClienteResponseDTO crearCliente(ClienteCreateDTO dto) {
        //1.Validar DNI
        if (iClienteRepository.existsByDni(dto.getDni())) {
            throw new ClienteExisteException("DNI", dto.getDni().toString());
        }

        //2.Validar CONTACTOS duplicados (mail, telefono, etc)
        if (dto.getContactos() != null) {
            for (ContactoInputDTO contactoInputDTO : dto.getContactos()) {
                if (iContactoRepository.existsByDetalle(contactoInputDTO.getDetalle())) {
                    throw new ClienteExisteException(
                            contactoInputDTO.getMedio().name(),
                            contactoInputDTO.getDetalle()
                    );
                }
            }
        }

        //Construir entidad
        Cliente cliente = new Cliente();
        cliente.setNombre(dto.getNombre());
        cliente.setApellido(dto.getApellido());
        cliente.setDni(dto.getDni());
        cliente.setFechaNacimiento(dto.getFechaNacimiento());
        cliente.setFechaAlta(LocalDateTime.now());

        if (dto.getContactos() != null) {
            List<Contacto> contactos = dto.getContactos().stream()
                    .map(c -> {
                        Contacto contacto = new Contacto();
                        contacto.setDetalle(c.getDetalle());
                        contacto.setMedio(c.getMedio());
                        contacto.setCliente(cliente);
                        return contacto;
                    })
                    .toList();
            cliente.getContacto().addAll(contactos);
        }

        Cliente guardado = iClienteRepository.save(cliente);
        return ClienteMapper.toDTO(guardado);
    }

    //BUSCAR X ID
    @Transactional(readOnly = true)
    public ClienteResponseDTO buscarPorId(Long id) {
        Cliente cliente = obtenerClienteOExcepcion(id);
        return ClienteMapper.toDTO(cliente);
    }

    //buscar clientes activos
    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> listarActivos() {
        return iClienteRepository.findByActivoTrue()
                .stream()
                .map(ClienteMapper::toDTO)
                .toList();
    }

    //buscar clientes por nombre / apellido
    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> buscarPorNombreOApellido(String termino) {
        //El termino se pasa x el repositorio dos veces buscando tanto nombre o apellido . revisar inconsistencias del modelo
        return iClienteRepository
                .findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(termino, termino)
                .stream()
                .map(ClienteMapper :: toDTO)
                .toList();
    }

    //actualizar datos del cliente
    @Transactional
    public ClienteResponseDTO actualizarCliente(Long id, ClienteUpdateDTO dto) {
        Cliente cliente = obtenerClienteOExcepcion(id);

        //solo piso si el front mando el campo
        if(dto.getNombre() != null) cliente.setNombre(dto.getNombre());
        if(dto.getApellido() != null) cliente.setApellido(dto.getApellido());
        if(dto.getFechaNacimiento() != null) cliente.setFechaNacimiento(dto.getFechaNacimiento());

        // Si vienen contactos nuevos: reemplazamos la lista completa.
        if(dto.getContactos() != null) {
            cliente.getContacto().clear();
            List<Contacto> nuevos = dto.getContactos().stream()
                    .map(c-> {
                        Contacto contacto = new Contacto();
                        contacto.setDetalle(c.getDetalle());
                        contacto.setMedio(c.getMedio());
                        contacto.setCliente(cliente);
                        return contacto;
                    })
                    .toList();
            cliente.getContacto().addAll(nuevos);
        }

        Cliente actualizado = iClienteRepository.save(cliente);
        return ClienteMapper.toDTO(actualizado);
    }

    //baja logica de cliente
    @Transactional
    public void darDeBaja(Long id) {
        Cliente cliente = obtenerClienteOExcepcion(id);

        boolean tieneViajesActivos =
                iViajeRepository.existsByClienteIdClienteAndActivoTrue(id);

        if(tieneViajesActivos) {
            throw new ClienteConViajesActivosException(id);
        }

        cliente.setActivo(false);
        iClienteRepository.save(cliente);
    }


    //metodo interno
    public Cliente obtenerClienteOExcepcion(Long id) {
        return iClienteRepository.findByIdCliente(id)
                .orElseThrow(() -> new ClienteNotFoundException(id));
    }

}
