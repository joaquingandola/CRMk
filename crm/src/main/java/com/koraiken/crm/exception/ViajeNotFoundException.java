package com.koraiken.crm.exception;

public class ViajeNotFoundException extends RuntimeException {
    public ViajeNotFoundException(Long id) {
        super("No existe un viaje con id: " + id);
    }
}
