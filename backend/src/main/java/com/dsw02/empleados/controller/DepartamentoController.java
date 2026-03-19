package com.dsw02.empleados.controller;

import com.dsw02.empleados.model.DepartamentoCreateRequest;
import com.dsw02.empleados.model.DepartamentoResponse;
import com.dsw02.empleados.model.DepartamentoUpdateRequest;
import com.dsw02.empleados.service.BadRequestException;
import com.dsw02.empleados.service.DepartamentoService;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/departamentos")
public class DepartamentoController {

    private final DepartamentoService departamentoService;

    public DepartamentoController(DepartamentoService departamentoService) {
        this.departamentoService = departamentoService;
    }

    @PostMapping
    public ResponseEntity<DepartamentoResponse> create(@Valid @RequestBody DepartamentoCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(departamentoService.create(request));
    }

    @GetMapping
    public ResponseEntity<Page<DepartamentoResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "clave,asc") String sort) {
        Pageable pageable = buildPageable(page, size, sort);
        return ResponseEntity.ok(departamentoService.findAll(pageable));
    }

    @GetMapping("/{clave}")
    public ResponseEntity<DepartamentoResponse> findByClave(@PathVariable String clave) {
        return ResponseEntity.ok(departamentoService.findByClave(clave));
    }

    @PutMapping("/{clave}")
    public ResponseEntity<DepartamentoResponse> update(@PathVariable String clave,
                                                       @Valid @RequestBody DepartamentoUpdateRequest request) {
        return ResponseEntity.ok(departamentoService.update(clave, request));
    }

    @DeleteMapping("/{clave}")
    public ResponseEntity<Void> delete(@PathVariable String clave) {
        departamentoService.delete(clave);
        return ResponseEntity.noContent().build();
    }

    private Pageable buildPageable(int page, int size, String sort) {
        if (page < 0) {
            throw new BadRequestException("El parámetro 'page' debe ser mayor o igual a 0");
        }
        if (size < 1 || size > 100) {
            throw new BadRequestException("El parámetro 'size' debe estar entre 1 y 100");
        }
        return PageRequest.of(page, size, parseSort(sort));
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

        if (!"clave".equals(field) && !"nombre".equals(field)) {
            throw new BadRequestException("El parámetro 'sort' solo permite 'clave' o 'nombre'");
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
