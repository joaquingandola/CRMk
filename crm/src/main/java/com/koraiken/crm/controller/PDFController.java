package com.koraiken.crm.controller;


import com.koraiken.crm.exception.ViajeNotFoundException;
import com.koraiken.crm.model.Viaje;
import com.koraiken.crm.repository.IViajeRepository;
import com.koraiken.crm.service.PDFService;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/api/pdf")
public class PDFController {

    private final IViajeRepository viajeRepository;
    private final PDFService pdfService;

    @GetMapping("/{id}/export-pdf")
    public ResponseEntity<byte[]> exportPDF(@PathVariable Long id) throws Exception {
        Viaje viaje = viajeRepository.findById(id)
                .orElseThrow(() -> new ViajeNotFoundException(id));

        byte[] pdf = pdfService.generarPdf(viaje);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData(
                "attachment",
                "viaje-" + viaje.getIdViaje() + ".pdf"
                //TODO
        );
        headers.setContentLength(pdf.length);

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);

    }


}
