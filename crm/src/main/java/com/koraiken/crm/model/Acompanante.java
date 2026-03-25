package com.koraiken.crm.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "Acompanante")
public class Acompanante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAcompanante;

    private String nombre;
    private String apellido;
    private Integer dni;
    private Date fechaNacimiento;

    @ManyToMany(mappedBy = "acompanantes")
    private List<Viaje> viajes = new ArrayList<>();
}
