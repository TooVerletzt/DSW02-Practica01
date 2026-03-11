package com.dsw02.empleados.service;

import com.dsw02.empleados.model.EmpleadoCreateRequest;
import com.dsw02.empleados.model.EmpleadoUpdateRequest;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class EmpleadoValidationService {

    private static final int MAX_FIELD_LENGTH = 100;
    private static final Pattern CLAVE_PATTERN = Pattern.compile("^EMP-[1-9][0-9]*$");

    public void validateCreateRequest(EmpleadoCreateRequest request) {
        validateTextLength(request.getNombre(), "nombre");
        validateTextLength(request.getDireccion(), "dirección");
        validateTextLength(request.getTelefono(), "teléfono");
    }

    public void validateUpdateRequest(EmpleadoUpdateRequest request) {
        validateTextLength(request.getNombre(), "nombre");
        validateTextLength(request.getDireccion(), "dirección");
        validateTextLength(request.getTelefono(), "teléfono");
    }

    public void validateClaveFormat(String clave) {
        if (clave == null || clave.isBlank()) {
            throw new BadRequestException("La clave es obligatoria");
        }

        if (!CLAVE_PATTERN.matcher(clave).matches()) {
            throw new BadRequestException("La clave debe cumplir el formato EMP-<número>");
        }
    }

    public String normalizeText(String value, String fieldName) {
        if (value == null) {
            throw new BadRequestException("El campo " + fieldName + " es obligatorio");
        }

        String normalized = value.trim();
        if (normalized.isEmpty()) {
            throw new BadRequestException("El campo " + fieldName + " es obligatorio");
        }

        if (normalized.length() > MAX_FIELD_LENGTH) {
            throw new BadRequestException("El campo " + fieldName + " excede 100 caracteres");
        }

        return normalized;
    }

    private void validateTextLength(String value, String fieldName) {
        if (value != null && value.trim().length() > MAX_FIELD_LENGTH) {
            throw new BadRequestException("El campo " + fieldName + " excede 100 caracteres");
        }
    }
}
