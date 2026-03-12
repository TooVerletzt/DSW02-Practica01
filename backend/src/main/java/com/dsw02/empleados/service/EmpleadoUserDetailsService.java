package com.dsw02.empleados.service;

import com.dsw02.empleados.model.Empleado;
import com.dsw02.empleados.repository.EmpleadoRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmpleadoUserDetailsService implements UserDetailsService {

    private final EmpleadoRepository empleadoRepository;

    public EmpleadoUserDetailsService(EmpleadoRepository empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String normalizedEmail = username == null ? "" : username.trim().toLowerCase();

        Empleado empleado = empleadoRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Credenciales invalidas"));

        return User.withUsername(empleado.getEmail())
                .password(empleado.getPasswordHash())
                .roles(empleado.getRole().name())
                .build();
    }
}
