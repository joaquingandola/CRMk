package com.koraiken.crm.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Contacto")
public class Contacto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idContacto;

    private String detalle;

    @Enumerated(EnumType.STRING)
    private Medio medio;

    @ManyToOne
    @JoinColumn(name = "idCliente")
    private Cliente cliente;
}
