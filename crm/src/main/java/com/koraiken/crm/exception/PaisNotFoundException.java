package com.koraiken.crm.exception;

public class PaisNotFoundException extends RuntimeException {
    public PaisNotFoundException(Long id) {
        super("No existe un país con id: " + id);
    }
}
