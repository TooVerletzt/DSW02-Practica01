package com.dsw02.empleados.repository;

import com.dsw02.empleados.model.Empleado;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface EmpleadoRepository extends JpaRepository<Empleado, String> {

    Page<Empleado> findAll(Pageable pageable);

    Optional<Empleado> findByEmail(String email);

    @Query(value = "SELECT COALESCE(MAX(CAST(SUBSTRING(clave FROM 5) AS BIGINT)), 0) FROM empleados", nativeQuery = true)
    long findMaxConsecutivo();
}
