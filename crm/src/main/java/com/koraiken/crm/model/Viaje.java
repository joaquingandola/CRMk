package com.koraiken.crm.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "Viaje")
public class Viaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idViaje;

    private LocalDateTime fechaFinViaje;
    private LocalDateTime fechaInicioViaje;
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    private Double precio;
    private Boolean activo = false;

    @ManyToOne @JoinColumn(name = "idAerolinea", foreignKey = @ForeignKey(name = "AEROLINEA_ID_FK"))
    private Aerolinea aerolinea;

    @OneToMany(mappedBy = "viaje")
    private List<EstadoViaje> estadosViaje;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idCliente")
    private Cliente cliente;

    @OneToMany(mappedBy = "viaje")
    private List<Destino> destinos = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "viajeAcompanante",
            joinColumns = @JoinColumn(name = "idViaje"),
            inverseJoinColumns = @JoinColumn(name = "idAcompanante")
    )
    private List<Acompanante> acompanantes = new ArrayList<>();
}
