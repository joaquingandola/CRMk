package com.koraiken.crm.exception;

public class ViajeSuperpuestoException extends RuntimeException {
    public ViajeSuperpuestoException() {
        super("El cliente tiene un viaje registrado que coincide con las fechas ingresadas");
    }
}
