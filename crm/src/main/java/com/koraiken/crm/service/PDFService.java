package com.koraiken.crm.service;

import com.koraiken.crm.dto.Acompanante.AcompananteResponseDTO;
import com.koraiken.crm.dto.Cliente.ClienteResponseDTO;
import com.koraiken.crm.dto.Destino.DestinoEnViajeDTO;
import com.koraiken.crm.dto.Viaje.ViajeResponseDTO;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@Service
public class PDFService {

    private static final DateTimeFormatter FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FECHA_HORA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final Color COLOR_HEADER = new Color(30, 41, 59);

    private static final Font FONT_TITULO = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
    private static final Font FONT_SUBTITULO = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, COLOR_HEADER);
    private static final Font FONT_LABEL = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
    private static final Font FONT_NORMAL = FontFactory.getFont(FontFactory.HELVETICA, 10);
    private static final Font FONT_GRIS = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.GRAY);
    private static final Font FONT_TABLA_HEADER = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);

    public byte[] generarPDF(ViajeResponseDTO viaje, ClienteResponseDTO cliente) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 40, 40, 50, 40);
        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            agregarEncabezado(document, viaje);
            agregarDatosCliente(document, cliente);
            agregarDatosViaje(document, viaje);
            agregarDestinos(document, viaje);
            agregarAcompanantes(document, viaje);

            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("No se pudo generar el PDF del viaje", e);
        }
        return baos.toByteArray();
    }

    private void agregarEncabezado(Document document, ViajeResponseDTO viaje) throws DocumentException {
        document.add(new Paragraph("Resumen de Viaje", FONT_TITULO));
        document.add(new Paragraph("Generado el " + LocalDate.now().format(FECHA), FONT_GRIS));
        document.add(espacio());
    }

    private void agregarDatosCliente(Document document, ClienteResponseDTO cliente) throws DocumentException {
        document.add(new Paragraph("Datos del Cliente", FONT_SUBTITULO));
        document.add(espacioChico());
        document.add(new Paragraph(cliente.getNombre() + " " + cliente.getApellido(), FONT_NORMAL));
        document.add(new Paragraph("DNI: " + (cliente.getDni() != null ? cliente.getDni() : "—"), FONT_NORMAL));
        document.add(new Paragraph("Fecha de nacimiento: " + formatFecha(cliente.getFechaNacimiento()), FONT_NORMAL));
        document.add(new Paragraph(
                "Agente responsable: " + (cliente.getNombreAgente() != null ? cliente.getNombreAgente() : "—"),
                FONT_NORMAL));
        document.add(espacio());
    }

    private void agregarDatosViaje(Document document, ViajeResponseDTO viaje) throws DocumentException {
        document.add(new Paragraph("Detalle del Viaje", FONT_SUBTITULO));
        document.add(espacioChico());

        PdfPTable tabla = new PdfPTable(2);
        tabla.setWidthPercentage(100);
        tabla.setWidths(new float[]{30, 70});

        agregarFila(tabla, "Fecha inicio", formatFecha(viaje.getFechaInicioViaje()));
        agregarFila(tabla, "Fecha fin", formatFecha(viaje.getFechaFinViaje()));
        agregarFila(tabla, "Aerolínea", viaje.getAerolinea() != null ? viaje.getAerolinea().getAerolinea() : "—");
        agregarFila(tabla, "Estado actual", viaje.getEstadoActual() != null
                ? viaje.getEstadoActual().getEstadoConcretoViaje().name() : "—");
        agregarFila(tabla, "Precio", formatMonto(viaje.getPrecio()));
        agregarFila(tabla, "Fecha de creación", viaje.getFechaCreacion() != null
                ? viaje.getFechaCreacion().format(FECHA_HORA) : "—");

        document.add(tabla);
        document.add(espacio());
    }

    private void agregarDestinos(Document document, ViajeResponseDTO viaje) throws DocumentException {
        List<DestinoEnViajeDTO> destinos = viaje.getDestinos();
        document.add(new Paragraph("Destinos (" + destinos.size() + ")", FONT_SUBTITULO));
        document.add(espacioChico());

        if (destinos.isEmpty()) {
            document.add(new Paragraph("Sin destinos cargados.", FONT_NORMAL));
            document.add(espacio());
            return;
        }

        PdfPTable tabla = new PdfPTable(5);
        tabla.setWidthPercentage(100);
        tabla.setWidths(new float[]{5, 22, 18, 25, 30});
        agregarHeader(tabla, "#", "Ciudad", "País", "Fechas", "Hotel");

        List<DestinoEnViajeDTO> ordenados = destinos.stream()
                .sorted(Comparator.comparing(
                        DestinoEnViajeDTO::getFechaLlegada,
                        Comparator.nullsLast(Comparator.naturalOrder())
                ))
                .toList();

        int i = 1;
        for (DestinoEnViajeDTO d : ordenados) {
            tabla.addCell(celda(String.valueOf(i++)));
            tabla.addCell(celda(d.getCiudad().getNombre()));
            tabla.addCell(celda(d.getCiudad().getPais()));
            tabla.addCell(celda(formatFecha(d.getFechaLlegada()) + " - " + formatFecha(d.getFechaSalida())));
            tabla.addCell(celda(formatHotel(d)));
        }

        document.add(tabla);
        document.add(espacio());
    }

    private void agregarAcompanantes(Document document, ViajeResponseDTO viaje) throws DocumentException {
        List<AcompananteResponseDTO> acompanantes = viaje.getAcompanantes();
        document.add(new Paragraph("Acompañantes (" + acompanantes.size() + ")", FONT_SUBTITULO));
        document.add(espacioChico());

        if (acompanantes.isEmpty()) {
            document.add(new Paragraph("Sin acompañantes registrados.", FONT_NORMAL));
            return;
        }

        PdfPTable tabla = new PdfPTable(3);
        tabla.setWidthPercentage(100);
        tabla.setWidths(new float[]{45, 25, 30});
        agregarHeader(tabla, "Nombre", "DNI", "Fecha de nacimiento");

        for (AcompananteResponseDTO a : acompanantes) {
            tabla.addCell(celda(a.getNombre() + " " + a.getApellido()));
            tabla.addCell(celda(a.getDni() != null ? String.valueOf(a.getDni()) : "—"));
            tabla.addCell(celda(formatFechaNacimiento(a.getFechaNacimiento())));
        }

        document.add(tabla);
    }

    private String formatHotel(DestinoEnViajeDTO d) {
        if (d.getHotel() == null) return "—";
        String nombre = d.getHotel().getNombre();
        String direccion = d.getHotel().getDireccion();
        if (direccion == null || direccion.isBlank()) return nombre;
        return nombre + " - " + direccion;
    }

    private String formatFecha(LocalDate fecha) {
        return fecha != null ? fecha.format(FECHA) : "—";
    }

    private String formatFechaNacimiento(Date fecha) {
        if (fecha == null) return "—";
        return fecha.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().format(FECHA);
    }

    private String formatMonto(Double precio) {
        if (precio == null) return "—";
        return String.format(new Locale("es", "AR"), "$%,.2f", precio);
    }

    private void agregarFila(PdfPTable tabla, String label, String valor) {
        PdfPCell celdaLabel = new PdfPCell(new Paragraph(label, FONT_LABEL));
        celdaLabel.setBorder(Rectangle.NO_BORDER);
        celdaLabel.setPadding(4);
        tabla.addCell(celdaLabel);

        PdfPCell celdaValor = new PdfPCell(new Paragraph(valor, FONT_NORMAL));
        celdaValor.setBorder(Rectangle.NO_BORDER);
        celdaValor.setPadding(4);
        tabla.addCell(celdaValor);
    }

    private void agregarHeader(PdfPTable tabla, String... columnas) {
        for (String col : columnas) {
            PdfPCell celda = new PdfPCell(new Paragraph(col, FONT_TABLA_HEADER));
            celda.setBackgroundColor(COLOR_HEADER);
            celda.setPadding(5);
            tabla.addCell(celda);
        }
    }

    private PdfPCell celda(String texto) {
        PdfPCell celda = new PdfPCell(new Paragraph(texto != null ? texto : "—", FONT_NORMAL));
        celda.setPadding(5);
        return celda;
    }

    private Paragraph espacio() {
        Paragraph p = new Paragraph(" ");
        p.setSpacingAfter(6);
        return p;
    }

    private Paragraph espacioChico() {
        Paragraph p = new Paragraph(" ", FONT_NORMAL);
        p.setSpacingAfter(2);
        return p;
    }
}
