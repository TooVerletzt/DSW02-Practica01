package com.dsw02.empleados.service;

import com.dsw02.empleados.model.Departamento;
import com.dsw02.empleados.model.DepartamentoCreateRequest;
import com.dsw02.empleados.model.DepartamentoResponse;
import com.dsw02.empleados.model.DepartamentoUpdateRequest;
import com.dsw02.empleados.repository.DepartamentoRepository;
import com.dsw02.empleados.repository.EmpleadoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DepartamentoService {

    private final DepartamentoRepository departamentoRepository;
    private final EmpleadoRepository empleadoRepository;

    public DepartamentoService(DepartamentoRepository departamentoRepository,
                               EmpleadoRepository empleadoRepository) {
        this.departamentoRepository = departamentoRepository;
        this.empleadoRepository = empleadoRepository;
    }

    @Transactional
    public DepartamentoResponse create(DepartamentoCreateRequest request) {
        Departamento departamento = new Departamento();
        departamento.setClave(generateNextClave());
        departamento.setNombre(normalizeNombre(request.getNombre()));
        return mapToResponse(departamentoRepository.save(departamento));
    }

    @Transactional(readOnly = true)
    public Page<DepartamentoResponse> findAll(Pageable pageable) {
        return departamentoRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public DepartamentoResponse findByClave(String clave) {
        return mapToResponse(getByClaveOrThrow(clave));
    }

    @Transactional
    public DepartamentoResponse update(String clave, DepartamentoUpdateRequest request) {
        Departamento departamento = getByClaveOrThrow(clave);
        departamento.setNombre(normalizeNombre(request.getNombre()));
        return mapToResponse(departamentoRepository.save(departamento));
    }

    @Transactional
    public void delete(String clave) {
        Departamento departamento = getByClaveOrThrow(clave);
        if (empleadoRepository.existsByDepartamento_Clave(departamento.getClave())) {
            throw new ConflictException("No se puede eliminar el departamento porque tiene empleados asociados");
        }
        departamentoRepository.delete(departamento);
    }

    @Transactional(readOnly = true)
    public Departamento resolveOptional(String departamentoClave) {
        if (departamentoClave == null) {
            return null;
        }
        String normalized = departamentoClave.trim();
        if (normalized.isEmpty()) {
            return null;
        }
        return departamentoRepository.findById(normalized)
                .orElseThrow(() -> new BadRequestException("El departamento indicado no existe"));
    }

    private synchronized String generateNextClave() {
        long currentMax = departamentoRepository.findMaxConsecutivo();
        return "DEP-" + (currentMax + 1);
    }

    private Departamento getByClaveOrThrow(String clave) {
        String normalizedClave = normalizeClave(clave);
        return departamentoRepository.findById(normalizedClave)
                .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado"));
    }

    private String normalizeClave(String clave) {
        if (clave == null) {
            throw new BadRequestException("La clave es obligatoria");
        }
        String normalized = clave.trim();
        if (normalized.isEmpty()) {
            throw new BadRequestException("La clave es obligatoria");
        }
        if (normalized.length() > 16) {
            throw new BadRequestException("La clave del departamento excede 16 caracteres");
        }
        return normalized;
    }

    private String normalizeNombre(String nombre) {
        if (nombre == null) {
            throw new BadRequestException("El nombre es obligatorio");
        }
        String normalized = nombre.trim();
        if (normalized.isEmpty()) {
            throw new BadRequestException("El nombre es obligatorio");
        }
        if (normalized.length() > 100) {
            throw new BadRequestException("El nombre excede 100 caracteres");
        }
        return normalized;
    }

    private DepartamentoResponse mapToResponse(Departamento departamento) {
        DepartamentoResponse response = new DepartamentoResponse();
        response.setClave(departamento.getClave());
        response.setNombre(departamento.getNombre());
        return response;
    }
}
