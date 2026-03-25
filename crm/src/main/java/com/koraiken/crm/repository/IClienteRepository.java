package com.koraiken.crm.repository;
import com.koraiken.crm.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface IClienteRepository extends JpaRepository<Cliente, Long>{
    Optional <Cliente> findByIdCliente(Long id);

    /*  Optional<Cliente> findByMail(String mail);
        Optional<Cliente> findByTelefono(String telefono);*/

    // Buscar por DNI (para evitar duplicados al cargar)
    Optional <Cliente> findByDni(Integer dni);

    // Solo clientes activos (para listar en pantalla)
    List<Cliente> findByActivoTrue();

    //busqueda de clientes por nombre o apellido
    List<Cliente> findByNombreContainingIgnoreCaseorApellidoContainingIgnoreCase(
            String nombre, String apellido
    );

    //solo clientes que estan viajando
    List<Cliente> findByEnViajeTrue();

    //verificar si existe email o telefono antes de crear, para validaciones
    boolean existsByMail(String mail);
    boolean existsByTelefono(String telefono);
    boolean existsByDni(Integer dni);
}
