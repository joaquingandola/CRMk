package com.koraiken.crm.exception;

public class ViajeTransicionInvalidaException extends RuntimeException {
    public ViajeTransicionInvalidaException(String desde, String hacia) {
        super("No se puede pasar de " +desde+ " a " + hacia);
    }
}
