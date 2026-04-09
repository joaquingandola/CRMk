package com.koraiken.crm.service;


import com.koraiken.crm.dto.Importacion.ImportacionResultadoDTO;
import com.koraiken.crm.model.Ciudad;
import com.koraiken.crm.model.Pais;
import com.koraiken.crm.repository.ICiudadRepository;
import com.koraiken.crm.repository.IPaisRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImportacionCiudadService {
    private final ICiudadRepository ciudadRepository;
    private final IPaisRepository paisRepository;

    @Transactional
    public ImportacionResultadoDTO importarCiudades(MultipartFile archivo) {
        int importadas = 0;
        int errores = 0;

        Map<String, Pais> cachePaises = new HashMap<>();

        try (
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(archivo.getInputStream(), StandardCharsets.UTF_8)
                );
                CSVParser parser = CSVFormat.DEFAULT
                        .withFirstRecordAsHeader()
                        .withIgnoreHeaderCase()
                        .withTrim()
                        .parse(reader)
        ) {
            for (CSVRecord fila : parser) {
                try {
                    String nombreCiudad = fila.get("city");
                    String nombrePais   = fila.get("country");
                    String latStr       = fila.get("lat");
                    String lngStr       = fila.get("lng");

                    if (nombreCiudad.isBlank() || nombrePais.isBlank()
                            || latStr.isBlank() || lngStr.isBlank()) {
                        errores++;
                        continue;
                    }

                    Double latitud  = Double.parseDouble(latStr);
                    Double longitud = Double.parseDouble(lngStr);

                    // Resolver o crear país con cache
                    Pais pais = cachePaises.computeIfAbsent(nombrePais, nombre ->
                            paisRepository.findByNombre(nombre)
                                    .orElseGet(() -> {
                                        Pais nuevo = new Pais();
                                        nuevo.setNombre(nombre);
                                        return paisRepository.save(nuevo);
                                    })
                    );

                    Ciudad ciudad = new Ciudad();
                    ciudad.setNombre(nombreCiudad);
                    ciudad.setPais(pais);
                    ciudad.setLatitud(latitud);
                    ciudad.setLongitud(longitud);
                    ciudadRepository.save(ciudad);
                    importadas++;

                } catch (Exception e) {
                    errores++;
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Error al procesar el archivo CSV: " + e.getMessage());
        }

        return ImportacionResultadoDTO.builder()
                .importadas(importadas)
                .errores(errores)
                .mensaje(String.format(
                        "Importación completa: %d ciudades importadas, %d errores.",
                        importadas, errores
                ))
                .build();
    }
}