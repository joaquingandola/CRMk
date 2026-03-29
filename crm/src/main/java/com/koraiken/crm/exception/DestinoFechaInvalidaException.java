package com.koraiken.crm.exception;

public class DestinoFechaInvalidaException extends RuntimeException {
    public DestinoFechaInvalidaException() {
        super("La fecha de llegada debe ser anterior a la fecha de salida.");
    }
}
