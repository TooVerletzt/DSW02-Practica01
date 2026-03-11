package com.dsw02.empleados.service;

import com.dsw02.empleados.model.Empleado;
import com.dsw02.empleados.model.EmpleadoCreateRequest;
import com.dsw02.empleados.model.EmpleadoResponse;
import com.dsw02.empleados.model.EmpleadoUpdateRequest;
import com.dsw02.empleados.repository.EmpleadoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final EmpleadoValidationService validationService;

    public EmpleadoService(EmpleadoRepository empleadoRepository,
                           EmpleadoValidationService validationService) {
        this.empleadoRepository = empleadoRepository;
        this.validationService = validationService;
    }

    @Transactional
    public EmpleadoResponse create(EmpleadoCreateRequest request) {
        validationService.validateCreateRequest(request);

        Empleado empleado = new Empleado();
        empleado.setClave(generateNextClave());
        empleado.setNombre(validationService.normalizeText(request.getNombre(), "nombre"));
        empleado.setDireccion(validationService.normalizeText(request.getDireccion(), "dirección"));
        empleado.setTelefono(validationService.normalizeText(request.getTelefono(), "teléfono"));

        Empleado saved = empleadoRepository.save(empleado);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<EmpleadoResponse> findAll(Pageable pageable) {
        return empleadoRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public EmpleadoResponse findByClave(String clave) {
        validationService.validateClaveFormat(clave);
        Empleado empleado = empleadoRepository.findById(clave)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));
        return mapToResponse(empleado);
    }

    @Transactional
    public EmpleadoResponse update(String clave, EmpleadoUpdateRequest request) {
        validationService.validateClaveFormat(clave);
        validationService.validateUpdateRequest(request);

        Empleado empleado = empleadoRepository.findById(clave)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));

        empleado.setNombre(validationService.normalizeText(request.getNombre(), "nombre"));
        empleado.setDireccion(validationService.normalizeText(request.getDireccion(), "dirección"));
        empleado.setTelefono(validationService.normalizeText(request.getTelefono(), "teléfono"));

        Empleado saved = empleadoRepository.save(empleado);
        return mapToResponse(saved);
    }

    @Transactional
    public void delete(String clave) {
        validationService.validateClaveFormat(clave);
        Empleado empleado = empleadoRepository.findById(clave)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));
        empleadoRepository.delete(empleado);
    }

    private synchronized String generateNextClave() {
        long currentMax = empleadoRepository.findMaxConsecutivo();
        return "EMP-" + (currentMax + 1);
    }

    private EmpleadoResponse mapToResponse(Empleado empleado) {
        EmpleadoResponse response = new EmpleadoResponse();
        response.setClave(empleado.getClave());
        response.setNombre(empleado.getNombre());
        response.setDireccion(empleado.getDireccion());
        response.setTelefono(empleado.getTelefono());
        return response;
    }
}
