package com.koraiken.crm.service;


import com.cloudinary.Cloudinary;
import com.koraiken.crm.repository.IAcompananteRepository;
import com.koraiken.crm.repository.IClienteRepository;
import com.koraiken.crm.repository.IImagenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ImagenService {
    private final Cloudinary cloudinary;
    private final IClienteRepository clienteRepository;
    private final IAcompananteRepository acompananteRepository;
    private final IImagenRepository imagenRepository;


}
