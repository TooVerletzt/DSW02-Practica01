package com.dsw02.empleados.controller;

import com.dsw02.empleados.model.EmpleadoCreateRequest;
import com.dsw02.empleados.model.EmpleadoResponse;
import com.dsw02.empleados.model.EmpleadoUpdateRequest;
import com.dsw02.empleados.service.BadRequestException;
import com.dsw02.empleados.service.EmpleadoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/empleados")
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    public EmpleadoController(EmpleadoService empleadoService) {
        this.empleadoService = empleadoService;
    }

    @PostMapping
    public ResponseEntity<EmpleadoResponse> create(@Valid @RequestBody EmpleadoCreateRequest request) {
        EmpleadoResponse created = empleadoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<Page<EmpleadoResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "clave,asc") String sort) {
        Pageable pageable = buildPageable(page, size, sort);
        return ResponseEntity.ok(empleadoService.findAll(pageable));
    }

    @GetMapping("/{clave}")
    public ResponseEntity<EmpleadoResponse> findByClave(@PathVariable String clave) {
        return ResponseEntity.ok(empleadoService.findByClave(clave));
    }

    @PutMapping("/{clave}")
    public ResponseEntity<EmpleadoResponse> update(@PathVariable String clave,
                                                   @Valid @RequestBody EmpleadoUpdateRequest request) {
        return ResponseEntity.ok(empleadoService.update(clave, request));
    }

    @DeleteMapping("/{clave}")
    public ResponseEntity<Void> delete(@PathVariable String clave) {
        empleadoService.delete(clave);
        return ResponseEntity.noContent().build();
    }

    private Pageable buildPageable(int page, int size, String sort) {
        if (page < 0) {
            throw new BadRequestException("El parámetro 'page' debe ser mayor o igual a 0");
        }
        if (size < 1 || size > 100) {
            throw new BadRequestException("El parámetro 'size' debe estar entre 1 y 100");
        }
        Sort parsedSort = parseSort(sort);
        return PageRequest.of(page, size, parsedSort);
    }

    private Sort parseSort(String sort) {
        if (sort == null || sort.isBlank()) {
            throw new BadRequestException("El parámetro 'sort' es obligatorio");
        }
        String[] parts = sort.split(",");
        if (parts.length != 2) {
            throw new BadRequestException("El parámetro 'sort' debe tener formato campo,direccion");
        }

        String field = parts[0].trim();
        String directionRaw = parts[1].trim();

        if (!"clave".equals(field)) {
            throw new BadRequestException("El parámetro 'sort' solo permite el campo 'clave'");
        }

        Sort.Direction direction;
        try {
            direction = Sort.Direction.fromString(directionRaw);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("El parámetro 'sort' solo permite dirección 'asc' o 'desc'");
        }

        return Sort.by(direction, field);
    }
}
