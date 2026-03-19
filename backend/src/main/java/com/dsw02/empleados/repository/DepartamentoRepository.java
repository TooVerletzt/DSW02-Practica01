package com.dsw02.empleados.repository;

import com.dsw02.empleados.model.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DepartamentoRepository extends JpaRepository<Departamento, String> {

    @Query(value = "SELECT COALESCE(MAX(CAST(SUBSTRING(clave FROM 5) AS BIGINT)), 0) FROM departamentos WHERE clave ~ '^DEP-[0-9]+$'", nativeQuery = true)
    long findMaxConsecutivo();
}
