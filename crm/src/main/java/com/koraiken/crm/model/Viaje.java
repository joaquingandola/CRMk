package com.koraiken.crm.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.cglib.core.Local;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
@Setter
@Getter
@Entity
@Table(name = "Viaje")
public class Viaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idViaje;

    private LocalDateTime fechaSalida;
    private LocalDateTime fechaLlegada;
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    private Double precio;
    private Boolean activo = false;

    @ManyToOne @JoinColumn(name = "idAerolinea", foreignKey = @ForeignKey(name = "AEROLINEA_ID_FK"))
    private Aerolinea aerolinea;

    @OneToMany(mappedBy = "viaje")
    private EstadoViaje estadoViaje;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idCliente")
    private Cliente cliente;

    public Viaje(){

    }
}
