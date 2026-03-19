CREATE TABLE IF NOT EXISTS departamentos (
    clave VARCHAR(16) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

ALTER TABLE empleados
    ADD COLUMN IF NOT EXISTS departamento_clave VARCHAR(16);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_empleados_departamento'
    ) THEN
        ALTER TABLE empleados
            ADD CONSTRAINT fk_empleados_departamento
            FOREIGN KEY (departamento_clave) REFERENCES departamentos(clave);
    END IF;
END $$;
