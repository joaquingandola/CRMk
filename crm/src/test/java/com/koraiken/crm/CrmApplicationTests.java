package com.koraiken.crm;

import com.koraiken.crm.model.Cliente;
import com.koraiken.crm.model.EstadoViaje;
import com.koraiken.crm.model.Viaje;
import com.koraiken.crm.repository.IClienteRepository;
import com.koraiken.crm.repository.IViajeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;

@SpringBootTest
class CrmApplicationTests {

	@Test
	void contextLoads() {
	}

    @Bean
    CommandLineRunner test(IViajeRepository viajeRepo, IClienteRepository clienteRepo){
        return args -> {
            Cliente c = clienteRepo.findByTelefono("123").orElseThrow();
            Viaje v = new Viaje();
            v.setDestino("Madrid");
            v.setEstado(EstadoViaje.COTIZADO);
            v.setCliente(c);
            viajeRepo.save(v);
        };
    }
}
