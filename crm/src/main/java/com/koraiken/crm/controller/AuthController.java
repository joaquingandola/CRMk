package com.koraiken.crm.controller;


import com.koraiken.crm.dto.Auth.AuthResponse;
import com.koraiken.crm.dto.Auth.LoginRequest;
import com.koraiken.crm.dto.Auth.RegisterRequest;
import com.koraiken.crm.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authService.register(registerRequest));
    }

    @GetMapping("/api/test")
    public String test() {
        return "OK - Authenticated"; //funciona con la misma token del user y
    }

}
