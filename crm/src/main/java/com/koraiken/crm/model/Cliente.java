package com.koraiken.crm.model;

import jakarta.persistence.*;
import org.springframework.cglib.core.Local;
import java.util.List;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Entity
@Table(name = "Cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_cliente;

    @OneToMany(mappedBy = "cliente")
    private List<Viaje> viajes = new ArrayList<>();

    private String nombre;
    private String apellido;
    private String email;
    private boolean activo = true;
    private Integer dni;

    @Column(unique = true, nullable = false)
    private String telefono;

    @Column(length = 500)
    private String observaciones;

    private LocalDateTime fechaCreacion = LocalDateTime.now();

    public Cliente(){

    }
}