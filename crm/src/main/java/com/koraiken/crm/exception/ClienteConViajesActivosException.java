package com.koraiken.crm.exception;

public class ClienteConViajesActivosException extends RuntimeException{
    public ClienteConViajesActivosException (Long id) {
        super("El cliente con id " + id + " tiene viajes activos y no puede darse de baja.");
    }
}
