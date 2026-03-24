package com.koraiken.crm.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

public class EstadoViaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEstadoViaje;

    @Enumerated(EnumType.STRING)
    private EstadoConcretoViaje estadoConcretoViaje;

    @LastModifiedDate
    private LocalDateTime fechaActualizacion;


}
