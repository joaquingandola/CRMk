package com.koraiken.crm.exception;

public class AerolineaNotFoundException extends RuntimeException {
    public AerolineaNotFoundException(Long id) {
        super("No existe una aerolinea con id: " + id);
    }
}
