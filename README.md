# Clínica UNER - Sistema de turnos

Trabajo Final Integrador de Desarrollo de Aplicaciones Web 2026 (Tecnicatura Universitaria en Desarrollo Web, UNER).

Sistema web para reservar turnos de una clínica con médicos clínicos. Hay tres roles:

- **Paciente:** reserva turnos, ve sus turnos y los cancela (hasta el día anterior).
- **Médico:** ve sus turnos de una fecha y los marca como atendido o ausente.
- **Administrador:** reserva, lista (con filtros) y cancela turnos (hasta que empieza la consulta), y modifica el valor de la consulta de cada médico.

## Integrantes

- Heynen Tobias
- Torres Nancy Graciela
- Troillan Romina Ileana
- Paula F. Solis
- Cristian Sambrana

## Tecnologías

| Parte | Tecnología |
|---|---|
| Backend | NestJS + TypeORM |
| Base de datos | PostgreSQL |
| Frontend | Angular |
| Servidor web / proxy | nginx |
| Gestor de procesos | PM2 |
| Documentación | Swagger + Compodoc |

## Estructura

```
.
├── backend/               API NestJS
│   ├── db/schema.sql      tablas y enums de la base
│   ├── src/
│   └── .env.example
├── frontend/              app Angular
├── nginx/clinica.conf     configuración de nginx
├── ecosystem.config.cjs   configuración de PM2
└── docs/                  guion del video
```

## Requisitos

- Node.js 22 o superior
- PostgreSQL 16 o superior
- PM2: `npm install -g pm2`
- nginx ([descarga para Windows](https://nginx.org/en/download.html) o `apt install nginx` en Linux)
- Angular CLI: `npm install -g @angular/cli`

## Base de datos

```bash
psql -U postgres -c "CREATE DATABASE clinica"
psql -U postgres -d clinica -f backend/db/schema.sql
psql -U postgres -d clinica -f backend/db/seed.sql
```

### Usuarios de prueba

Se cargan con `backend/db/seed.sql`.

| Rol | Documento | Clave |
|---|---|---|
| Administrador | _a completar_ | _a completar_ |
| Médico | _a completar_ | _a completar_ |
| Paciente | _a completar_ | _a completar_ |
| Usuario dado de baja (no puede entrar) | _a completar_ | _a completar_ |

## Variables de entorno

El backend lee la configuración del archivo `backend/.env`. Para crearlo, copiá el ejemplo y completá los datos:

```bash
cd backend
cp .env.example .env
```

| Variable | Para qué sirve |
|---|---|
| `PORT` | Puerto del backend (3000 por defecto) |
| `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` | Conexión a PostgreSQL |
| `DB_LOGGING` | `true` muestra las consultas SQL en consola |
| `SWAGGER_HABILITADO` | `true` habilita Swagger en `/api/docs` |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Firma y duración del token de login |

## Desarrollo

Backend (queda en `http://localhost:3000`):

```bash
cd backend
npm install
npm run start:dev
```

Frontend (queda en `http://localhost:4200`):

```bash
cd frontend
npm install
npm start
```

En desarrollo, el frontend usa un proxy (`frontend/proxy.conf.json`) que manda todo lo que empieza con `/api` al backend. Por eso todas las llamadas se hacen con rutas relativas (`/api/v1/...`).

## Producción con nginx y PM2

### 1. Compilar

```bash
cd backend
npm install
npm run build

cd ../frontend
npm install
npm run build
```

### 2. Levantar el backend con PM2

Desde la raíz del repositorio:

```bash
pm2 start ecosystem.config.cjs --env production
pm2 status                 # ver que clinica-backend esté "online"
pm2 logs clinica-backend   # ver los logs
pm2 restart clinica-backend
pm2 stop clinica-backend
```

PM2 corre `backend/dist/main.js` dentro de la carpeta `backend`, así que toma el `.env` de ahí. Los logs quedan en `backend/logs/`.

### 3. Configurar nginx

`nginx/clinica.conf` hace dos cosas:

- sirve el build de Angular, y devuelve `index.html` en cualquier ruta del front para que funcione la navegación;
- reenvía `/api/` al backend en `http://127.0.0.1:3000`.

Antes de usarlo, cambiá la línea `root` por la ruta absoluta a `frontend/dist/frontend/browser` de tu máquina.

**Windows:** copiá el bloque `server { ... }` de `nginx/clinica.conf` dentro del bloque `http { ... }` de `C:\nginx\conf\nginx.conf` (o donde lo hayas descomprimido). Las rutas van con `/`, por ejemplo `root E:/Facultad/clinica/frontend/dist/frontend/browser;`. Después:

```powershell
cd C:\nginx
.\nginx.exe -t          # verifica la configuración
start nginx             # inicia
.\nginx.exe -s reload   # recarga después de cambiar la config
.\nginx.exe -s stop     # detiene
```

**Linux:**

```bash
sudo cp nginx/clinica.conf /etc/nginx/conf.d/clinica.conf
sudo nginx -t
sudo systemctl reload nginx
```

La aplicación queda en `http://localhost:8080`.

## Documentación

- **Swagger:** con `SWAGGER_HABILITADO=true`, entrar a `http://localhost:3000/api/docs` (o `http://localhost:8080/api/docs` a través de nginx).
- **Compodoc:**

```bash
cd backend
npm run compodoc          # genera backend/documentation
npm run compodoc:serve    # genera y la sirve en http://localhost:8081
```

En el frontend, los mismos scripts se agregan en `frontend/package.json` y generan `frontend/documentation`.

## API

Todas las rutas tienen el prefijo `/api/v1`.

| Método | Ruta | Rol |
|---|---|---|
| POST | `/auth/login` | público |
| GET | `/medicos` | todos |
| GET | `/medicos/:id/horarios-disponibles?fecha=YYYY-MM-DD` | paciente, administrador |
| PATCH | `/medicos/:id/valor-consulta` | administrador |
| GET | `/pacientes` | administrador |
| POST | `/reservas` | paciente, administrador |
| GET | `/reservas?fecha&idMedico&idPaciente&estado` | todos |
| PATCH | `/reservas/:id/cancelar` | paciente, administrador |
| PATCH | `/reservas/:id/estado` | médico |

El detalle de cada endpoint está en Swagger.

## Reglas de negocio

- Se atiende de lunes a viernes de 8 a 16 hs. Los turnos duran una hora, y el último es a las 15 hs.
- No se puede reservar un horario que ya está ocupado para ese médico, ni darle a un paciente dos turnos a la misma hora.
- Se puede reservar con hasta 30 días de anticipación.
- El valor de la consulta se guarda al reservar y no cambia aunque después se modifique el precio del médico.
- Solo pueden iniciar sesión los usuarios en estado `ACTIVO`.

El reparto de tareas del grupo está en [TAREAS.md](TAREAS.md).
