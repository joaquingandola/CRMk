package com.koraiken.crm.repository;
import com.koraiken.crm.model.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.koraiken.crm.model.Cliente;


public interface IViajeRepository extends JpaRepository<Viaje, Long> {
    List<Viaje> findByClienteId(Long id_cliente);
}
