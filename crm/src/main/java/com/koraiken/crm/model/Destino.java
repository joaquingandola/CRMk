package com.koraiken.crm.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "Destino")
public class Destino {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDestino;

    private LocalDateTime fechaLlegada;
    private LocalDateTime fechaSalida;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idCiudad", nullable = false)
    private Ciudad ciudad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idViaje", nullable = false)
    private Viaje viaje;
}
