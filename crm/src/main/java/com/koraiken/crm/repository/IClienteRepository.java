package com.koraiken.crm.repository;
import com.koraiken.crm.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IClienteRepository extends JpaRepository<Cliente, Long>{
    Optional<Cliente> findByTelefono(String telefono);
}
