package com.dsw02.empleados.config;

import com.dsw02.empleados.model.Empleado;
import com.dsw02.empleados.model.EmpleadoRole;
import com.dsw02.empleados.repository.EmpleadoRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class EmpleadoSeedInitializer implements ApplicationRunner {

    private final EmpleadoRepository empleadoRepository;
    private final PasswordEncoder passwordEncoder;

    public EmpleadoSeedInitializer(EmpleadoRepository empleadoRepository,
                                   PasswordEncoder passwordEncoder) {
        this.empleadoRepository = empleadoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (empleadoRepository.count() > 0) {
            return;
        }

        Empleado admin = new Empleado();
        admin.setClave("EMP-1");
        admin.setNombre("Admin Demo");
        admin.setDireccion("N/A");
        admin.setTelefono("N/A");
        admin.setEmail("admin@demo.com");
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        admin.setRole(EmpleadoRole.ADMIN);

        Empleado user = new Empleado();
        user.setClave("EMP-2");
        user.setNombre("User Demo");
        user.setDireccion("N/A");
        user.setTelefono("N/A");
        user.setEmail("user@demo.com");
        user.setPasswordHash(passwordEncoder.encode("user123"));
        user.setRole(EmpleadoRole.USER);

        empleadoRepository.save(admin);
        empleadoRepository.save(user);
    }
}
