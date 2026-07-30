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

## Puesta en marcha desde cero

Estos son todos los pasos para levantar el proyecto en una máquina nueva. No hace falta pedir ninguna credencial a nadie: la base de datos se crea vacía y se puebla con el Excel que viene en el repositorio.

**1. Crear una base de datos.** Un cluster gratuito M0 en [MongoDB Atlas](https://www.mongodb.com/atlas) vale, o un MongoDB local. En Atlas, crea un usuario de base de datos y en *Network Access* permite `0.0.0.0/0`. Copia la cadena de conexión.

**2. Backend.**

```bash
cd backend
npm install
cp .env.example .env
```

Abre `backend/.env` y rellena dos valores:

- `MONGODB_URI` — la cadena del paso 1.
- `JWT_SECRET` — cualquier cadena larga que te inventes.

**3. Poblar la base de datos desde el Excel.**

```bash
npm run seed
```

Debe imprimir `Leyendo datos de devhub-datos.xlsx (7 hojas)` y el recuento de cada colección. Ojo: el comando **borra** las colecciones antes de cargar.

**4. Arrancar el backend.**

```bash
npm run dev
```

**5. Frontend**, en otra terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

**6. Entrar.** Abre la URL que imprime Vite (normalmente `http://localhost:5173`) y usa cualquiera de estas cuentas, todas con contraseña `Password123!`:

| Rol | Email |
|---|---|
| Freelancer | `laura.roca@devhub-mail.com` |
| Cliente | `bruno.perez@devhub-mail.com` |
| Admin | `julia.vila@devhub-mail.com` |

Los tres roles ven interfaces distintas: el menú de usuario, el dashboard y las acciones disponibles cambian según el rol.

## 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # completar con tus valores reales
```

### Variables de entorno (`backend/.env`)

| Variable | Descripción | ¿Obligatoria? |
|---|---|---|
| `MONGODB_URI` | Cadena de conexión a MongoDB (Atlas o local) | **Sí** |
| `JWT_SECRET` | Secreto para firmar los tokens JWT. Cualquier cadena larga sirve | **Sí** |
| `PORT` | Puerto del servidor | No (por defecto `5000`) |
| `NODE_ENV` | `development` / `production` | No |
| `FRONTEND_URL` | URL del frontend, usada por CORS | No (por defecto `*`) |

Ninguna de estas variables se comparte: `MONGODB_URI` apunta a **tu propia** base de datos y `JWT_SECRET` te lo inventas. Ver [Puesta en marcha desde cero](#puesta-en-marcha-desde-cero).

> **MongoDB Atlas:** en *Network Access* añade `0.0.0.0/0` ("Allow Access from Anywhere"), o la app no arrancará desde una IP que no esté en la lista blanca.

### Poblar la base de datos (seed)

Los datos de ejemplo se generan **a partir del Excel** `backend/seeds/data/devhub-datos.xlsx`, que tiene una hoja por colección: `usuarios`, `servicios`, `proyectos`, `portfolio`, `posts`, `transacciones` y `reviews`. Nada está hardcodeado en el script: `seed.js` lee el libro, resuelve las relaciones entre hojas y las inserta en Mongo.

```bash
npm run seed   # limpia las colecciones y carga devhub-datos.xlsx
```

El orden de inserción importa y lo respeta el script: las hojas se referencian entre sí por columnas naturales (`*_email`, `*_titulo`) porque los `_id` de Mongo no existen hasta que se inserta cada documento. Si una fila no puede resolver su relación, se omite con un aviso en consola en lugar de abortar el seed.

Los mismos datos están además como CSV sueltos en esa carpeta, que `seed.js` usa como respaldo si el `.xlsx` no está presente. El formato de columnas está documentado en `backend/seeds/data/README.md`.

> El paquete que lee el Excel (SheetJS) se instala desde el CDN oficial del proyecto y no desde el registro npm, porque la versión publicada en npm está congelada en la 0.18.5 con vulnerabilidades sin parchear. Por eso en `package.json` esa dependencia apunta a una URL. Va como `devDependency`: sembrar es tarea de desarrollo.

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

## Usuarios de prueba

El seed crea 35 usuarios, todos con contraseña `Password123!`. Las cuentas de cada rol están en [Puesta en marcha desde cero](#puesta-en-marcha-desde-cero); la lista completa, en la hoja `usuarios` del Excel.

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

- **Subida de imágenes:** no hay endpoint de upload conectado; los campos de imagen (foto de perfil, portfolio, posts) son inputs de texto para pegar una URL ya alojada. Por eso **no hacen falta credenciales de Cloudinary** para ejecutar el proyecto, pese a que el paquete siga listado como dependencia.
- Sin Socket.io/chat en tiempo real, sin integración de pagos (Stripe/PayPal), sin deploy configurado — fuera del alcance de esta entrega.
