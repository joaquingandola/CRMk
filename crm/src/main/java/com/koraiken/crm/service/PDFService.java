package com.koraiken.crm.service;

import com.koraiken.crm.model.Viaje;
import com.lowagie.text.Document;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;


@Service
public class PDFService {

    public byte[] generarPDF(Viaje viaje) throws Exception{
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);

    }

}
