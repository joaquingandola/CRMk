package com.koraiken.crm.repository;
import com.koraiken.crm.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IClienteRepository extends JpaRepository<Cliente, Long>{
    Optional <Cliente> findByIdCliente(Long id);

    Optional <Cliente> findByDni(Integer dni);

    //activos
    List<Cliente> findByActivoTrueAndAgenteIdUsuario(Long idAgente);
    List<Cliente> findByActivoTrue();

    @Query("""
        SELECT c FROM Cliente c
        WHERE c.agente.idUsuario =:idAgente
        AND (
        LOWER(c.nombre) LIKE LOWER(CONCAT('%', :termino, '%'))
        OR LOWER(c.apellido) LIKE LOWER(CONCAT('%', :termino, '%'))
        )
""") List<Cliente> findByAgenteIdUsuarioAndTermino(
      @Param("idAgente") Long idAgente,
      @Param("termino") String termino
    );

    List <Cliente> findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(
            String nombre, String apellido
    );


    //verificar si existe email o telefono antes de crear, para validaciones - navegacion de propiedades de Spring Data
    boolean existsByDni(Integer dni);
}
