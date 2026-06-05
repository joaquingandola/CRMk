package com.koraiken.crm.exception;

public class ObservacionNoEncontradaException extends RuntimeException {
    public ObservacionNoEncontradaException(Long idObservacion) {
        super("No existe la observacion con id: " + idObservacion);
    }
}
