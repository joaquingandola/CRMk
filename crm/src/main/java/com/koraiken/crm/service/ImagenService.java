package com.koraiken.crm.service;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.koraiken.crm.dto.Imagen.ImagenResponseDTO;
import com.koraiken.crm.exception.AcompananteNotFoundException;
import com.koraiken.crm.exception.ClienteNotFoundException;
import com.koraiken.crm.model.Acompanante;
import com.koraiken.crm.model.Cliente;
import com.koraiken.crm.model.Imagen;
import com.koraiken.crm.model.TipoDocumento;
import com.koraiken.crm.repository.IAcompananteRepository;
import com.koraiken.crm.repository.IClienteRepository;
import com.koraiken.crm.repository.IImagenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImagenService {
    private final Cloudinary cloudinary;
    private final IClienteRepository clienteRepository;
    private final IAcompananteRepository acompananteRepository;
    private final IImagenRepository imagenRepository;

    //subir imagen de cliente
    @Transactional
    public ImagenResponseDTO subirImagenCliente(
            Long idCliente, MultipartFile archivo, TipoDocumento tipoDocumento, String alt) {
        Cliente cliente = clienteRepository.findByIdCliente(idCliente)
                .orElseThrow(()-> new ClienteNotFoundException(idCliente));
        Map resultado = subirACloud(archivo, "clientes/" + idCliente);
        Imagen imagen = new Imagen();
        imagen.setPublicId((String) resultado.get("public_id"));
        imagen.setUrl((String) resultado.get("secure_url"));
        imagen.setAlt(alt);
        imagen.setTipoDocumento(tipoDocumento);
        imagen.setCliente(cliente);

        return toDTO(imagenRepository.save(imagen));
    }

    //subir imagen de acompanante
    @Transactional
    public ImagenResponseDTO subirImagenAcompanante(Long idAcompanante,
                                                    MultipartFile archivo,
                                                    TipoDocumento tipoDocumento,
                                                    String alt) {
        Acompanante acompanante = acompananteRepository.findById(idAcompanante)
                .orElseThrow(()-> new AcompananteNotFoundException(idAcompanante));
        Map resultado = subirACloud(archivo, "acompanantes/" +idAcompanante);
        Imagen imagen = new Imagen();
        imagen.setPublicId((String) resultado.get("public_id"));
        imagen.setUrl((String) resultado.get("secure_url"));
        imagen.setAlt(alt);
        imagen.setTipoDocumento(tipoDocumento);
        imagen.setAcompanante(acompanante);
        return toDTO(imagenRepository.save(imagen));
    }

    //listar por cliente y luego x acompanante
    @Transactional(readOnly = true)
    public List<ImagenResponseDTO> listarImagenesPorCliente(Long idCliente) {
        return imagenRepository.findByClienteIdCliente(idCliente)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ImagenResponseDTO> listarImagenesPorAcompanante(Long idAcompanante) {
        return imagenRepository.findByAcompananteIdAcompanante(idAcompanante)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    //eliminar
    @Transactional
    public void eliminarImagen(Long idImagen) {
        Imagen imagen = imagenRepository.findById(idImagen)
                .orElseThrow(() -> new RuntimeException("Imagen no encontrada: " + idImagen));
        try {
            cloudinary.uploader().destroy(imagen.getPublicId(), ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new RuntimeException("Error al eliminar la imagen: " + e.getMessage());
        }
        imagenRepository.delete(imagen);
    }

    //metodos internos
    private ImagenResponseDTO toDTO(Imagen imagen) {
        String url = generarUrlFirmada(imagen.getPublicId());
        return ImagenResponseDTO.builder()
                .idImagen(imagen.getIdImagen())
                .url(url)
                .alt(imagen.getAlt())
                .tipoDocumento(imagen.getTipoDocumento())
                .build();
    }

    public String generarUrlFirmada(String publicId) {
        try {
            long expiracion = System.currentTimeMillis() / 1000 + 3600;
            return cloudinary.url()
                    .signed(true)
                    //falta expirar
                    .generate(publicId);
        } catch (Exception e) {
            throw new RuntimeException("Error al generar URL firmada" + e.getMessage());
        }
    }

    private Map subirACloud(MultipartFile archivo, String carpeta) {
        try {
            return cloudinary.uploader().upload(
                    archivo.getBytes(),
                    ObjectUtils.asMap(
                            "folder", carpeta,
                            "type", "authenticated",
                            "resource_type", "auto"
                    )
            );
        } catch (IOException e) {
            throw new RuntimeException("ERROR AL SUBIR EL ARCHIVO: " + e.getMessage());
        }
    }
}
