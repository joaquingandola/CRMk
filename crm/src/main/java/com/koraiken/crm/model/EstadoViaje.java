package com.koraiken.crm.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.LastModifiedDate;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@Entity
@Table(name = "EstadoViaje")
public class EstadoViaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEstadoViaje;

    @Enumerated(EnumType.STRING)
    private EstadoConcretoViaje estadoConcretoViaje;

    @LastModifiedDate
    private LocalDateTime fechaActualizacion;
}
