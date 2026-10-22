-- Esquema según el modelo de datos de la consigna.
-- Uso: psql -U postgres -d clinica -f db/schema.sql

CREATE TYPE estados_usuarios AS ENUM ('ACTIVO', 'BAJA');
CREATE TYPE roles_usuarios AS ENUM ('MEDICO', 'PACIENTE', 'ADMINISTRADOR');
CREATE TYPE estados_reservas AS ENUM ('ACTIVO', 'ATENDIDO', 'AUSENTE', 'CANCELADO');

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    documento TEXT NOT NULL UNIQUE,
    apellidos TEXT NOT NULL,
    nombres TEXT NOT NULL,
    email TEXT NOT NULL,
    clave TEXT NOT NULL,
    estado estados_usuarios NOT NULL,
    rol roles_usuarios NOT NULL
);

CREATE TABLE medicos (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE REFERENCES usuarios (id),
    matricula INT NOT NULL,
    valor_consulta INT NOT NULL
);

CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    id_medico INT NOT NULL REFERENCES medicos (id),
    id_paciente INT NOT NULL REFERENCES usuarios (id),
    fecha_hora TIMESTAMP NOT NULL,
    estado estados_reservas NOT NULL DEFAULT 'ACTIVO',
    valor_consulta INT NOT NULL
);

-- Un médico no puede tener dos turnos activos en el mismo horario.
CREATE UNIQUE INDEX reservas_medico_horario_activo
    ON reservas (id_medico, fecha_hora)
    WHERE estado <> 'CANCELADO';
