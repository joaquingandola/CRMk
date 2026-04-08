package com.koraiken.crm.controller;

import com.koraiken.crm.dto.Acompanante.AcompananteResponseDTO;
import com.koraiken.crm.service.AcompananteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/acompanantes")
@RequiredArgsConstructor
public class AcompananteController {

    private final AcompananteService acompananteService;

    @PostMapping
    public ResponseEntity<AcompananteResponseDTO>

}
