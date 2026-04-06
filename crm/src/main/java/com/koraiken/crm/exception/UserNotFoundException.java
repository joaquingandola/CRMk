package com.koraiken.crm.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Long id) {
        super("No se encontro un usuario de id: " + id);
    }
}
