package com.koraiken.crm.exception;

public class CiudadYaExisteException extends RuntimeException {
    public CiudadYaExisteException(String nombre, String pais) {
        super("Ya existe la ciudad: " + nombre + " de " + pais);
    }
}
