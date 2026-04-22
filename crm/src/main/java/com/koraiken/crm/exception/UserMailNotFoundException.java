package com.koraiken.crm.exception;

public class UserMailNotFoundException extends RuntimeException {
    public UserMailNotFoundException(String mail) {
        super("No se puede encontrar el usuario: " + mail);
    }
}
