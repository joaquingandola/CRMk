package com.koraiken.crm.model;

import jakarta.persistence.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.util.List;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Entity
@Table(name = "Cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCliente;

    @OneToMany(mappedBy = "cliente")
    private List<Viaje> viajes = new ArrayList<>();

    @OneToMany(mappedBy = "cliente")
    private Contacto contacto;

    @OneToMany(mappedBy = "cliente")
    private List<Imagen> imagenes = new ArrayList<>();

    private String nombre;
    private String apellido;
    private String email;
    private Boolean activo = true;
    private Boolean enViaje;
    private Integer dni;
    private LocalDate fechaNacimiento;

    @Column(unique = true, nullable = false)
    private String telefono;

    @Column(length = 500)
    private String observaciones;

    private LocalDateTime fechaCreacion = LocalDateTime.now();

    public Cliente(){

    }
}