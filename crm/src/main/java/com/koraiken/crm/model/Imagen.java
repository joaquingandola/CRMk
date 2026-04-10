package com.koraiken.crm.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "Imagen")
public class Imagen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idImagen;

    private String publicId;
    private String url;
    private String alt;

    @Enumerated(EnumType.STRING)
    private TipoDocumento tipoDocumento;

    @ManyToOne
    @JoinColumn(name = "idAcompanante")
    private Acompanante acompanante;

    @ManyToOne
    @JoinColumn(name = "idCliente")
    private Cliente cliente;
}
