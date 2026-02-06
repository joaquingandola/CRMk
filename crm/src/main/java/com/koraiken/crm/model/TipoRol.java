package com.koraiken.crm.model;

public enum TipoRol {
    AGENTE,
    ADMIN;

    public boolean isAgente(){
        return this == AGENTE;
    }
    public boolean isAdmin(){
        return this == ADMIN;
    }
}
