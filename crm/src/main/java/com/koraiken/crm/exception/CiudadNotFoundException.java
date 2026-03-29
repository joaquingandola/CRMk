package com.koraiken.crm.exception;

public class CiudadNotFoundException extends RuntimeException {
    public CiudadNotFoundException(Long id) {
        super("No existe una ciudad con id" + id);
    }
}
