package com.koraiken.crm.model;

import jakarta.persistence.*;

public class Ciudad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private Double latitud;
    private Double longitud;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idPais", nullable = false)
    private Pais pais;
}
