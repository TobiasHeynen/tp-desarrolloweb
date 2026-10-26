-- Datos de prueba iniciales.
-- Uso: psql -U postgres -d clinica -f db/seed.sql
--
-- Clave de todos los usuarios: 123456
-- Hash bcrypt ($2b$10$): $2b$10$lS9dZ2WQ2tbZSXLY/jTtpOy6JeULnk4yLZfNTadNV/nkVwkEQ4UsG

TRUNCATE TABLE reservas, medicos, usuarios RESTART IDENTITY CASCADE;

-- 1 admin, 2 médicos, 3 pacientes activos y 1 usuario en BAJA
INSERT INTO usuarios (documento, apellidos, nombres, email, clave, estado, rol) VALUES
('10000001', 'Gómez',     'Laura',   'admin@clinica.com',      '$2b$10$lS9dZ2WQ2tbZSXLY/jTtpOy6JeULnk4yLZfNTadNV/nkVwkEQ4UsG', 'ACTIVO', 'ADMINISTRADOR'),
('20000001', 'Pérez',     'Carlos',  'cperez@clinica.com',     '$2b$10$lS9dZ2WQ2tbZSXLY/jTtpOy6JeULnk4yLZfNTadNV/nkVwkEQ4UsG', 'ACTIVO', 'MEDICO'),
('20000002', 'Fernández', 'María',   'mfernandez@clinica.com', '$2b$10$lS9dZ2WQ2tbZSXLY/jTtpOy6JeULnk4yLZfNTadNV/nkVwkEQ4UsG', 'ACTIVO', 'MEDICO'),
('30000001', 'Martínez',  'Juan',    'jmartinez@correo.com',   '$2b$10$lS9dZ2WQ2tbZSXLY/jTtpOy6JeULnk4yLZfNTadNV/nkVwkEQ4UsG', 'ACTIVO', 'PACIENTE'),
('30000002', 'Rodríguez', 'Sofía',   'srodriguez@correo.com',  '$2b$10$lS9dZ2WQ2tbZSXLY/jTtpOy6JeULnk4yLZfNTadNV/nkVwkEQ4UsG', 'ACTIVO', 'PACIENTE'),
('30000003', 'López',     'Diego',   'dlopez@correo.com',      '$2b$10$lS9dZ2WQ2tbZSXLY/jTtpOy6JeULnk4yLZfNTadNV/nkVwkEQ4UsG', 'ACTIVO', 'PACIENTE'),
('40000001', 'Sánchez',   'Roberto', 'rsanchez@correo.com',    '$2b$10$lS9dZ2WQ2tbZSXLY/jTtpOy6JeULnk4yLZfNTadNV/nkVwkEQ4UsG', 'BAJA',   'PACIENTE');

-- Filas de los 2 médicos en la tabla medicos
INSERT INTO medicos (id_usuario, matricula, valor_consulta) VALUES
(2, 12345, 25000),
(3, 54321, 30000);
