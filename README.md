# DevHub

Plataforma FullStack tipo "LinkedIn + Fiverr para developers": perfiles profesionales, marketplace de servicios, proyectos con propuestas, portfolio, reviews, feed social y panel de administración.

## Stack tecnológico

**Backend:** Node.js, Express, MongoDB + Mongoose, JWT + bcrypt, express-validator.
**Frontend:** React (Vite), React Router, Axios, Styled Components, TanStack Query, React Hook Form + Zod, React Toastify.

## Estructura del proyecto

```
FinalProject/
├── backend/     API REST (modelos, controllers, rutas, auth, seed)
├── frontend/    Aplicación React (SPA)
└── prompt_devhub.md   Especificación original del proyecto
```

## Requisitos previos

- Node.js 20+ y npm
- Una base de datos MongoDB (Atlas u otra instancia accesible por URI)

## 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # completar con tus valores reales
```

### Variables de entorno (`backend/.env`)

| Variable | Descripción |
|---|---|
| `MONGODB_URI` | Cadena de conexión a MongoDB (Atlas o local) |
| `JWT_SECRET` | Secreto para firmar los tokens JWT |
| `CLOUDINARY_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Credenciales de Cloudinary (opcional — ver "Limitaciones conocidas") |
| `PORT` | Puerto del servidor (por defecto `5000`) |
| `NODE_ENV` | `development` / `production` |
| `FRONTEND_URL` | URL del frontend, usada por CORS |

> **Importante (MongoDB Atlas):** en *Network Access* añade `0.0.0.0/0` ("Allow Access from Anywhere") para que cualquier evaluador/entorno pueda conectarse; si restringes por IP, la app no arrancará para quien no esté en la lista blanca.

### Poblar la base de datos (seed)

Los datos de ejemplo (usuarios, servicios, proyectos, portfolio, posts, transacciones, reviews) viven como archivos CSV en `backend/seeds/data/` — **no están hardcodeados en el script**, `seed.js` solo los lee con `fs` e inserta en Mongo. El formato exacto de columnas de cada CSV está documentado en `backend/seeds/data/README.md`.

```bash
npm run seed   # limpia las colecciones y carga los CSV de seeds/data/
```

### Arrancar el backend

```bash
npm run dev     # con nodemon
# o
npm start
```

API disponible en `http://localhost:5000/api`.

## 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

### Variables de entorno (`frontend/.env`)

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API del backend (por defecto `http://localhost:5000/api`) |

### Arrancar el frontend

```bash
npm run dev
```

App disponible en `http://localhost:5173`.

## Usuario de prueba (Admin)

El seed crea usuarios con contraseña `Password123!` para todos los roles (Freelancer, Cliente y Admin). Cualquier email de rol `Admin` en `backend/seeds/data/usuarios.csv` sirve para acceder al panel `/admin`.

## Roles y funcionalidades

- **Freelancer:** perfil con skills y portfolio, publica servicios, envía propuestas a proyectos, recibe reviews, ve sus transacciones.
- **Cliente:** busca freelancers por skills/rating, publica proyectos, recibe y acepta propuestas, deja reviews al completar un proyecto.
- **Admin:** verifica/desverifica freelancers, modera posts del feed, desactiva usuarios, consulta todas las transacciones.

## Reglas de negocio

1. Solo un Freelancer puede crear/editar/borrar sus propios Servicios.
2. Solo un Cliente puede crear Proyectos y asignar freelancer a los suyos.
3. Solo un Freelancer puede enviar propuestas a un Proyecto `Abierto`.
4. Una Review solo puede crearse si el Proyecto está `Completado`, por el Cliente propietario, y una vez por proyecto.
5. Una Transacción requiere que el Proyecto asociado (si aplica) tenga freelancer asignado, y que cliente/freelancer/servicio referenciados existan realmente en la base de datos.
6. Solo un Admin puede verificar freelancers, desactivar usuarios o moderar posts ajenos.

## Limitaciones conocidas

- **Subida de imágenes:** no hay endpoint de upload a Cloudinary conectado; los campos de imagen (foto de perfil, portfolio, posts) son inputs de texto para pegar una URL ya alojada.
- Sin Socket.io/chat en tiempo real, sin integración de pagos (Stripe/PayPal), sin deploy configurado — fuera del alcance de esta entrega.
