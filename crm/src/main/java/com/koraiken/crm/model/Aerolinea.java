package com.koraiken.crm.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class Aerolinea {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long idAerolinea;

    private String aerolinea;

    public Aerolinea() {

    }
}
