package com.koraiken.crm.model;

import jakarta.persistence.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.util.List;
import java.time.LocalDateTime;
import java.util.ArrayList;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity
@Table(name = "Cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCliente;

    @OneToMany(mappedBy = "cliente")
    private List<Viaje> viajes = new ArrayList<>();

    @OneToMany(mappedBy = "cliente")
    private List<Contacto> contacto = new ArrayList<>();

    @OneToMany(mappedBy = "cliente")
    private List<Imagen> imagenes = new ArrayList<>();

    @OneToMany(mappedBy = "cliente")
    private List<Observacion> observaciones = new ArrayList<>();

    private String nombre;
    private String apellido;
    private Boolean activo = true;
    private Boolean enViaje;
    private Integer dni;
    private LocalDate fechaNacimiento;
    private LocalDateTime fechaAlta = LocalDateTime.now();

    public Cliente(){

    }
}