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
    private Long id;

    private String path;
    private String alt;

    @ManyToOne
    @JoinColumn(name = "idCliente")
    private Cliente cliente;
}
