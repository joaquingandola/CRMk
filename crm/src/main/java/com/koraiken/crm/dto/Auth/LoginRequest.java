package com.koraiken.crm.dto.Auth;

import lombok.Getter;

@Getter
public class LoginRequest {
    private String email;
    private String password;
}
