package com.koraiken.crm.model;

import jakarta.persistence.*;

import java.util.Optional;

@Entity
@Table(name = "MedioTransporte")
public class MedioTransporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMedioTransporte;

    @Enumerated(EnumType.STRING)
    private TipoMedioTransporte medioTransporte;

    private String codigo;
    private String aerolinea;

    public Optional<String> getAerolinea() {
        return Optional.ofNullable(aerolinea);
    }
}
