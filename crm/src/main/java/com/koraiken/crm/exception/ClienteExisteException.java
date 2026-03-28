package com.koraiken.crm.exception;

public class ClienteExisteException extends RuntimeException{
    public ClienteExisteException (String campo, String valor) {
        super("Ya existe un cliente con " + campo + ": " + valor );
    }
}
