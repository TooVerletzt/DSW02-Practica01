ALTER TABLE empleados
    ADD COLUMN email VARCHAR(100) NOT NULL,
    ADD COLUMN password_hash VARCHAR(100) NOT NULL,
    ADD COLUMN role VARCHAR(10) NOT NULL;

ALTER TABLE empleados
    ADD CONSTRAINT uk_empleados_email UNIQUE (email);

ALTER TABLE empleados
    ADD CONSTRAINT chk_empleados_role
    CHECK (role IN ('ADMIN', 'USER'));
