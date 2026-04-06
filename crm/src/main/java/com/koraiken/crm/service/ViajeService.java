package com.koraiken.crm.service;

import com.koraiken.crm.repository.IClienteRepository;
import com.koraiken.crm.repository.IDestinoRepository;
import com.koraiken.crm.repository.IEstadoViajeRepository;
import com.koraiken.crm.repository.IViajeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ViajeService {

    private final IViajeRepository viajeRepository;
    private final IEstadoViajeRepository estadoViajeRepository;
    private final ClienteService clienteService;
    private final AerolineaService aerolineaService;
    private final AcompananteService acompananteService;
    private final DestinoService destinoService;
}
