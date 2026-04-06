package com.koraiken.crm.exception;

public class AcompananteNotFoundException extends RuntimeException {
    public AcompananteNotFoundException(Long id) {
        super("No existe un acompanante con id: " + id);
    }
}
