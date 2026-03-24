package com.koraiken.crm.model;

import jakarta.persistence.*;

public class Contacto {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idContacto;

    private String detalle;

    @Enumerated(EnumType.STRING)
    private Medio medio;
}
