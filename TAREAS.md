# Reparto de tareas: TP Final Clínica UNER

## Estado actual (base ya hecha)

El backend compila y levanta. Ya tiene:

- Entidades `Usuario`, `Medico` y `Reserva` según el modelo de la consigna. **No hay tabla de pacientes:** un paciente es un usuario con `rol = PACIENTE`.
- `db/schema.sql` crea los enums, las tablas y un índice único que impide que un médico tenga dos turnos activos en el mismo horario.
- `.env.example` con todas las variables. Para usarlo, copialo a `.env`.
- Los DTOs de entrada y salida y los endpoints ya están definidos. Los métodos de los services tiran `NotImplementedException`: **cada uno completa los suyos**.
- Swagger corre en `http://localhost:3000/api/docs` si `SWAGGER_HABILITADO=true`.

Para levantar el backend:

```bash
cd backend
npm install
cp .env.example .env            # ajustar credenciales de Postgres
psql -U postgres -c "create database clinica"
psql -U postgres -d clinica -f db/schema.sql
npm run start:dev
```

## Contrato de la API (prefijo `/api/v1`)

Las dos partes trabajan contra este contrato, así el front no espera al back y viceversa.

| Método | Ruta | Rol | Body / Query | Respuesta |
|---|---|---|---|---|
| POST | `/auth/login` | público | `{ documento, clave }` | `{ accessToken }` |
| GET | `/medicos` | todos | | `ListMedicosDto[]` |
| GET | `/medicos/:id/horarios-disponibles` | PACIENTE, ADMIN | `?fecha=YYYY-MM-DD` | `string[]` (`["08:00","09:00"]`) |
| PATCH | `/medicos/:id/valor-consulta` | ADMIN | `{ valorConsulta }` | |
| GET | `/pacientes` | ADMIN | | `UsuarioResumenDto[]` |
| POST | `/reservas` | PACIENTE, ADMIN | `{ idMedico, fechaHora, idPaciente? }` | `ListReservasDto` |
| GET | `/reservas` | todos | `?fecha&idMedico&idPaciente&estado` | `ListReservasDto[]` |
| PATCH | `/reservas/:id/cancelar` | PACIENTE, ADMIN | | |
| PATCH | `/reservas/:id/estado` | MEDICO | `{ estado: ATENDIDO \| AUSENTE }` | |

El payload del JWT es `{ sub: idUsuario, rol, idMedico? }`. `idMedico` solo viene si el rol es MEDICO.

## Reglas de negocio acordadas

- Se atiende de lunes a viernes. El primer turno es a las 8:00 y el último a las 15:00, y cada turno dura 1 hora en punto.
- No se puede reservar un horario ocupado del **mismo médico**. Tampoco puede un **mismo paciente** tener dos turnos a la misma hora, aunque sean con médicos distintos.
- No se puede reservar en el pasado ni con más de 30 días de anticipación.
- `valor_consulta` se copia del médico al reservar, y si después cambia el precio, la reserva no se modifica.
- El PACIENTE cancela sus propios turnos hasta las 23:59 del día anterior. El ADMIN puede cancelar hasta la hora de inicio.
- El MEDICO solo marca sus propios turnos, y solo si están en estado `ACTIVO`.
- Solo pueden loguearse los usuarios en estado `ACTIVO`.

---

## Persona 1: Tobias. Infraestructura y documentación (independiente)

Nada de esto depende de los demás. Se puede probar con el backend actual, que ya levanta, y con cualquier build de Angular, aunque sea la app vacía.

- [x] **PM2:** armar `ecosystem.config.cjs` en la raíz que levante `backend/dist/main.js` con `env_production`, y documentar `npm run build` + `pm2 start ecosystem.config.cjs` + `pm2 logs`/`pm2 status`.
- [x] **nginx:** armar `nginx/clinica.conf`. Tiene que servir el build de Angular (`frontend/dist/.../browser`) con `try_files $uri $uri/ /index.html` para que funcionen las rutas del SPA, y hacer `proxy_pass` de `/api/` a `http://localhost:3000`.
- [x] **Compodoc:** instalar `@compodoc/compodoc` como devDependency en el backend (ya existe el script `npm run compodoc`) y en el frontend cuando exista. Verificar que genera la carpeta `documentation`.
- [x] **README** de la raíz: requisitos (Node, Postgres, nginx, PM2), cómo levantar todo en dev y en "producción" (nginx + PM2), y usuarios de prueba (los toma de la persona 2).
- [x] **Guion del video** (8 a 12 min): qué muestra cada uno y en qué orden. Recordá que nginx y PM2 tienen que verse funcionando.

## Persona 2: Auth, seguridad y endpoints chicos

- [ ] `db/seed.sql` con 1 admin, 2 médicos (con su fila en `medicos`), 3 pacientes y 1 usuario en `BAJA`, todos con la clave hasheada con bcrypt. **Pasarlo pronto**, porque todos lo necesitan para probar.
- [ ] `AuthService.login`: buscar por `documento`, verificar `estado = ACTIVO`, comparar con `bcrypt.compare` y firmar el JWT con `JWT_SECRET`/`JWT_EXPIRES_IN` desde ConfigService. Ante cualquier error, devolver `401` con un mensaje genérico.
- [ ] `JwtAuthGuard`, `RolesGuard`, el decorador `@Roles(...)` y el decorador `@UsuarioActual()`, que devuelve el payload del token. **Prioridad alta**, porque la persona 3 los usa.
- [ ] Aplicar los guards en los 3 controllers según la columna "Rol" del contrato.
- [ ] `MedicosService`: `listarMedicos` (join con usuario para nombre y apellido) y `actualizarValorConsulta`, que no toca las reservas existentes.
- [ ] `PacientesService.listarPacientes`: usuarios con rol PACIENTE y estado ACTIVO, sin exponer la clave.

## Persona 3: Reservas, el núcleo del negocio

Hasta que estén los guards de la persona 2, podés hardcodear un usuario de prueba y después reemplazarlo por `@UsuarioActual()`.

- [ ] `crearReserva`: validar todas las reglas de arriba (día hábil, hora en punto entre 8 y 15, rango de 30 días, médico existente, horario libre para el médico y para el paciente) y congelar `valorConsulta`. Si el que reserva es PACIENTE, `idPaciente` sale del token; si es ADMIN, viene en el body.
- [ ] `listarReservas`: el PACIENTE ve solo las suyas, el MEDICO solo las suyas, y el ADMIN ve todas y puede aplicar los filtros. El mapeo a `ListReservasDto` se hace sin exponer la clave del paciente.
- [ ] `cancelarReserva`: aplicar la regla de tiempo según el rol, que el paciente solo pueda cancelar las suyas, y que solo se cancelen reservas `ACTIVO`.
- [ ] `cambiarEstado`: solo el médico dueño del turno, y solo sobre reservas `ACTIVO`.
- [ ] `horariosDisponibles`: devolver los slots de 08:00 a 15:00 de esa fecha que no estén ocupados para ese médico, y ninguno si es fin de semana o está fuera del rango permitido.
- [ ] Ojo con las zonas horarias: la columna es `timestamp` sin zona. Hay que acordar que siempre se guarda la hora local de Argentina y no mezclar con `toISOString()`.

## Persona 4: Frontend base + pantallas de paciente

- [ ] Crear el proyecto Angular en `frontend/` con el nombre `frontend` (`ng new frontend`), así el build queda en `frontend/dist/frontend/browser`, que es la ruta que usa nginx.
- [ ] Agregar Compodoc al frontend: `npm i -D @compodoc/compodoc` y los scripts `"compodoc": "compodoc -p tsconfig.json -d documentation"` y `"compodoc:serve": "compodoc -p tsconfig.json -d documentation -s --port 8082"`. Agregar `documentation` al `.gitignore`.
- [ ] Crear `proxy.conf.json` con `/api` → `http://localhost:3000`, configurado en `angular.json`. **Todas las llamadas con rutas relativas** (`/api/v1/...`), nunca `http://localhost:3000`.
- [ ] Login (documento + clave), un `AuthService` que guarde el token, un interceptor que mande el `Authorization: Bearer`, guards de ruta por rol, y un layout con menú según el rol.
- [ ] **Subir la base pronto**, así la persona 5 trabaja arriba.
- [ ] Pantallas de paciente: reservar turno (elegir médico, después fecha, después horario disponible, con el precio a la vista), mis turnos, y cancelar.

## Persona 5: Frontend de médico y administrador

Arranca con la base de la persona 4. Mientras tanto puede maquetar los componentes sueltos.

- [ ] Médico: agenda por fecha (selector de fecha y listado de sus turnos) y botones "Atendido" y "Ausente".
- [ ] Admin: listado de turnos con filtros (médico, paciente, fecha, estado), cancelar, y reservar para un paciente (elige el paciente de `/pacientes`).
- [ ] Admin: pantalla de médicos con edición del valor de la consulta.
- [ ] Manejo de errores: mostrar el mensaje del backend cuando una regla no se cumple.

---

## Dependencias entre tareas

- **Persona 2 → todos:** el seed y los guards. Conviene que salgan primero.
- **Persona 4 → persona 5:** la base de Angular (login, interceptor, layout).