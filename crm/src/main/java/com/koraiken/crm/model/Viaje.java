package com.koraiken.crm.model;
import jakarta.persistence.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
@Entity
@Table(name = "Viaje")
public class Viaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String destino;
    private LocalDateTime fecha_salida;
    private LocalDateTime fecha_llegada;
    private LocalDateTime fecha_actualizacion;
    private LocalDateTime fecha_creacion = LocalDateTime.now();
    private Integer pasajeros;
    private Double precio;

    @Enumerated(EnumType.STRING)
    private EstadoViaje estado;
    @ManyToOne(optional = false)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    public Viaje(){

    }
}
