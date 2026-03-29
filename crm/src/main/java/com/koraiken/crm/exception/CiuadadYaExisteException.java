package com.koraiken.crm.exception;

public class CiuadadYaExisteException extends RuntimeException {
    public CiuadadYaExisteException(String nombre, String pais) {
        super("Ya existe la ciudad: " + nombre + " de " + pais);
    }
}
