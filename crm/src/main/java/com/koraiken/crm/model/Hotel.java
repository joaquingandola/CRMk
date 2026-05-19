package com.koraiken.crm.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "Hotel")
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idHotel;

    private String nombre;
    private String direccion;

    @OneToOne(mappedBy = "hotel")
    private Destino destino;
}
