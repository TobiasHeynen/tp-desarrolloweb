# Guion del video (8 a 12 minutos)

Requisitos de la consigna:

- Aparecen todos los integrantes, con cámara y micrófono.
- Cada uno dice su nombre y apellido y explica lo que hizo **mientras usa el sistema**.
- Se tiene que ver funcionando nginx y PM2 (si no, se pierden puntos de la rúbrica).

Antes de grabar:

- [ ] Base cargada con `schema.sql` y `seed.sql`, y algunos turnos ya reservados para la demo.
- [ ] Backend compilado y levantado con PM2, y frontend compilado y servido por nginx.
- [ ] La app se abre en `http://localhost:8080`, es decir, a través de nginx y no con `ng serve`.
- [ ] Las pestañas listas: la app, Swagger (`/api/docs`), Compodoc y una terminal.
- [ ] Hay un turno para mañana (para mostrar que el paciente ya no lo puede cancelar) y uno para dentro de varios días.

## Orden y tiempos

| # | Tiempo | Quién | Qué muestra |
|---|---|---|---|
| 1 | 0:00 - 1:30 | Tobias Heynen | Presentación, arquitectura, PM2 y nginx |
| 2 | 1:30 - 3:30 | Persona 2 | Login, roles y seguridad |
| 3 | 3:30 - 5:30 | Persona 4 | Pantallas de paciente |
| 4 | 5:30 - 8:00 | Persona 5 | Pantallas de médico y administrador |
| 5 | 8:00 - 10:00 | Persona 3 | Reglas de negocio de las reservas |
| 6 | 10:00 - 11:00 | Tobias Heynen | Documentación (Swagger y Compodoc) y cierre |

## 1. Presentación e infraestructura (Tobias)

1. "Hola, soy Tobias Heynen. Hice la parte de infraestructura y documentación: la configuración de PM2, nginx, Compodoc y el README."
2. Mostrar la estructura del repo: `backend`, `frontend`, `nginx` y `ecosystem.config.cjs`.
3. En la terminal:
   - `pm2 start ecosystem.config.cjs --env production`
   - `pm2 status`: se ve `clinica-backend` en estado *online*.
   - `pm2 logs clinica-backend`: se ven las rutas que mapea Nest.
4. Abrir `nginx/clinica.conf` y explicar los dos bloques: `/` sirve Angular y `/api/` va al backend.
5. Correr `nginx -t` y después abrir `http://localhost:8080`. Explicar que el navegador habla solo con nginx, y que nginx le pasa al backend lo que empieza con `/api`.
6. Mostrar `.env.example` y explicar que la configuración sale de variables de entorno.

## 2. Login y roles (Persona 2)

1. Presentarse.
2. Entrar con el usuario dado de baja: tiene que rechazarlo.
3. Entrar con una clave incorrecta: tiene que rechazarlo.
4. Entrar como paciente y mostrar que el menú cambia según el rol.
5. Explicar el JWT y los guards por rol. Por ejemplo, mostrar en Swagger que `/pacientes` sin token devuelve 401 y con token de paciente devuelve 403.
6. Explicar que las claves están hasheadas con bcrypt (mostrar la tabla `usuarios`).

## 3. Paciente (Persona 4)

1. Presentarse.
2. Logueado como paciente: reservar un turno eligiendo médico, fecha y horario, y mostrar el precio.
3. Ver "Mis turnos".
4. Cancelar el turno de dentro de varios días: tiene que funcionar.
5. Intentar cancelar el de mañana: el sistema no lo deja.
6. Contar cómo funciona el proxy de desarrollo (`proxy.conf.json`) con rutas relativas.

## 4. Médico y administrador (Persona 5)

1. Presentarse.
2. Logueado como médico: elegir una fecha, ver sus turnos y marcar uno como **atendido** y otro como **ausente**.
3. Logueado como admin: listar los turnos y usar los filtros por médico, fecha y estado.
4. Reservar un turno para un paciente.
5. Cancelar un turno de hoy que todavía no empezó.
6. Cambiar el valor de la consulta de un médico y mostrar que **los turnos ya reservados mantienen el valor anterior**.

## 5. Reglas de negocio (Persona 3)

1. Presentarse.
2. Intentar reservar, uno por uno, estos casos. Todos tienen que fallar con un mensaje claro:
   - un horario ya ocupado del mismo médico;
   - un sábado o domingo;
   - una fecha a más de 30 días;
   - una fecha pasada.
3. Mostrar que los horarios disponibles van de 8 a 15 hs.
4. Mostrar el código del service de reservas y explicar las validaciones.
5. Mostrar un DTO de entrada y uno de salida, y explicar el `ValidationPipe`.

## 6. Documentación y cierre (Tobias)

1. Swagger en `http://localhost:8080/api/docs`: recorrer los endpoints y los DTOs.
2. Compodoc: `npm run compodoc:serve` y mostrar módulos, controllers y DTOs.
3. Cierre de 15 segundos: stack (NestJS, TypeORM, PostgreSQL, Angular, nginx y PM2) y saludo.

> Reemplazar "Persona 2" a "Persona 5" por los nombres reales según quién hizo cada parte (ver `TAREAS.md`).
