package com.koraiken.crm.exception;

public class AerolineaYaExisteException extends RuntimeException {
    public AerolineaYaExisteException(String nombre) {
        super("Ya existe la aerolinea: " + nombre);
    }
}
