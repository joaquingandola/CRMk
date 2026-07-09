package com.koraiken.crm.controller;

import com.koraiken.crm.dto.Cliente.ClienteResponseDTO;
import com.koraiken.crm.dto.Viaje.ViajeResponseDTO;
import com.koraiken.crm.service.ClienteService;
import com.koraiken.crm.service.PDFService;
import com.koraiken.crm.service.ViajeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/viajes")
public class PDFController {

    private final ViajeService viajeService;
    private final ClienteService clienteService;
    private final PDFService pdfService;

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> exportarPdf(@PathVariable Long id) {
        ViajeResponseDTO viaje = viajeService.buscarPorId(id);
        ClienteResponseDTO cliente = clienteService.buscarPorId(viaje.getIdCliente());

        byte[] pdf = pdfService.generarPDF(viaje, cliente);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename("viaje-" + viaje.getIdViaje() + ".pdf")
                        .build()
        );
        headers.setContentLength(pdf.length);

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }
}
