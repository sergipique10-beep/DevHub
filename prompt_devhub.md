# 🚀 PROMPT PARA CLAUDE CODE - DEVHUB

## 📋 PROYECTO: DevHub - LinkedIn para Programadores + Marketplace de Servicios

---

## 🎯 VISIÓN GENERAL

Crear una plataforma web FullStack tipo LinkedIn + Fiverr para desarrolladores donde pueden:
- Crear perfiles profesionales con portfolio
- Publicar servicios y proyectos
- Sistema de ratings y reviews
- Feed social
- Marketplace de servicios de desarrollo

**Stack Tecnológico:**
- Backend: Node.js + Express + MongoDB + Mongoose
- Frontend: React + React Router + Axios
- Estilos: Styled Components o Tailwind CSS
- Cloudinary: Subida de imágenes
- Autenticación: JWT + BCrypt
- Deploy: Vercel (Frontend) + Railway/Render (Backend)

---

## 📊 ESTRUCTURA DE COLECCIONES/MODELOS

### 1. **USUARIO**
```javascript
{
  _id: ObjectId,
  email: string (unique),
  password: string (hasheado),
  nombre: string,
  apellido: string,
  role: enum ["Admin", "Freelancer", "Cliente"],
  fotoPerfil: string (URL Cloudinary),
  bio: string,
  ubicacion: string,
  enlaces: {
    github: string,
    linkedin: string,
    portfolio: string
  },
  skills: [{
    nombre: string,
    nivel: number (1-5)
  }],
  experiencia: {
    años: number,
    descripcion: string
  },
  rating: {
    promedio: number (0-5),
    cantidad: number
  },
  verificado: boolean,
  activo: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **SERVICIO** (Ofrecidos por Freelancers)
```javascript
{
  _id: ObjectId,
  freelancer_id: ObjectId (ref Usuario),
  titulo: string,
  descripcion: string,
  categoria: string,
  precioBase: number,
  tiempoEntrega: number (días),
  imagenPrincipal: string (URL Cloudinary),
  tags: [string],
  activo: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. **PROYECTO** (Solicitudes de trabajos)
```javascript
{
  _id: ObjectId,
  cliente_id: ObjectId (ref Usuario),
  titulo: string,
  descripcion: string,
  presupuesto: number,
  deadline: Date,
  estado: enum ["Abierto", "En progreso", "Completado", "Cancelado"],
  propuestas: [{
    freelancer_id: ObjectId,
    precio: number,
    mensaje: string,
    createdAt: Date
  }],
  freelancer_asignado_id: ObjectId (ref Usuario),
  tecnologiasRequeridas: [string],
  createdAt: Date,
  updatedAt: Date
}
```

### 4. **TRANSACCION**
```javascript
{
  _id: ObjectId,
  cliente_id: ObjectId (ref Usuario),
  freelancer_id: ObjectId (ref Usuario),
  proyecto_id: ObjectId (ref Proyecto),
  servicio_id: ObjectId (ref Servicio),
  monto: number,
  estado: enum ["Pendiente", "Completada", "Reembolsada"],
  metodoPago: string,
  fecha: Date,
  createdAt: Date
}
```

### 5. **REVIEW/VALORACION**
```javascript
{
  _id: ObjectId,
  autor_id: ObjectId (ref Usuario),
  freelancer_id: ObjectId (ref Usuario),
  proyecto_id: ObjectId (ref Proyecto),
  puntuacion: number (1-5),
  comentario: string,
  aspectos: {
    comunicacion: number (1-5),
    calidad: number (1-5),
    puntualidad: number (1-5)
  },
  createdAt: Date
}
```

### 6. **PORTFOLIO**
```javascript
{
  _id: ObjectId,
  freelancer_id: ObjectId (ref Usuario),
  titulo: string,
  descripcion: string,
  imagenes: [string] (URLs Cloudinary),
  enlaceProyecto: string (URL al demo en vivo),
  repositorioGithub: string (URL del repo),
  tecnologias: [string],
  featured: boolean,
  views: number,
  createdAt: Date,
  updatedAt: Date
}
```

### 7. **POST** (Feed Social)
```javascript
{
  _id: ObjectId,
  autor_id: ObjectId (ref Usuario),
  contenido: string,
  imagen: string (URL Cloudinary),
  likes: [ObjectId] (ref Usuario),
  comentarios: [{
    usuario_id: ObjectId,
    contenido: string,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🏗️ ESTRUCTURA DE CARPETAS

```
devhub-proyecto/
│
├── 📁 backend/
│   ├── 📁 config/
│   │   └── db.js (conexión MongoDB)
│   │
│   ├── 📁 models/
│   │   ├── Usuario.js
│   │   ├── Servicio.js
│   │   ├── Proyecto.js
│   │   ├── Transaccion.js
│   │   ├── Review.js
│   │   ├── Portfolio.js
│   │   └── Post.js
│   │
│   ├── 📁 controllers/
│   │   ├── authController.js
│   │   ├── usuarioController.js
│   │   ├── servicioController.js
│   │   ├── proyectoController.js
│   │   ├── transaccionController.js
│   │   ├── reviewController.js
│   │   ├── portfolioController.js
│   │   └── postController.js
│   │
│   ├── 📁 routes/
│   │   ├── authRoutes.js
│   │   ├── usuarioRoutes.js
│   │   ├── servicioRoutes.js
│   │   ├── proyectoRoutes.js
│   │   ├── transaccionRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── portfolioRoutes.js
│   │   └── postRoutes.js
│   │
│   ├── 📁 middleware/
│   │   ├── authMiddleware.js (verificar JWT)
│   │   ├── roleMiddleware.js (verificar roles)
│   │   └── errorHandler.js
│   │
│   ├── 📁 seeds/
│   │   ├── data/ (CSV descargados)
│   │   └── seed.js (script para popular BD)
│   │
│   ├── 📁 utils/
│   │   ├── cloudinary.js (configuración)
│   │   └── validators.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Loading.jsx
│   │   │   │
│   │   │   ├── 📁 Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   │
│   │   │   ├── 📁 Freelancer/
│   │   │   │   ├── MisServicios.jsx
│   │   │   │   ├── MiPortfolio.jsx
│   │   │   │   └── Propuestas.jsx
│   │   │   │
│   │   │   ├── 📁 Cliente/
│   │   │   │   ├── CrearProyecto.jsx
│   │   │   │   ├── Proyectos.jsx
│   │   │   │   └── BuscarFreelancers.jsx
│   │   │   │
│   │   │   ├── 📁 Social/
│   │   │   │   ├── Feed.jsx
│   │   │   │   └── CrearPost.jsx
│   │   │   │
│   │   │   └── 📁 Perfil/
│   │   │       ├── PerfilFreelancer.jsx
│   │   │       ├── PerfilCliente.jsx
│   │   │       └── EditarPerfil.jsx
│   │   │
│   │   ├── 📁 pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Exploradores.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── 📁 context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── AppContext.jsx
│   │   │
│   │   ├── 📁 services/
│   │   │   ├── api.js (configuración Axios)
│   │   │   ├── authService.js
│   │   │   ├── usuarioService.js
│   │   │   ├── servicioService.js
│   │   │   ├── proyectoService.js
│   │   │   └── ...
│   │   │
│   │   ├── 📁 styles/
│   │   │   ├── globalStyles.js
│   │   │   └── theme.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.jsx
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── 📄 README.md (documentación completa)
├── 📄 .gitignore
└── 📁 data/ (Excel CSV exportados)
    ├── usuarios.csv
    ├── servicios.csv
    ├── proyectos.csv
    ├── transacciones.csv
    ├── reviews.csv
    ├── portfolio.csv
    └── posts.csv
```

---

## 🔐 FUNCIONALIDADES POR ROL

### 👨‍💼 **FREELANCER**
- ✅ Registrarse y crear perfil con skills
- ✅ Subir foto de perfil (Cloudinary)
- ✅ Crear servicios con descripción y precio
- ✅ Crear portfolio con proyectos (enlaces en vivo + GitHub)
- ✅ Ver propuestas recibidas de clientes
- ✅ Aceptar/Rechazar propuestas
- ✅ Ver proyectos en progreso y completados
- ✅ Recibir reviews de clientes
- ✅ Dashboard con ganancias/estadísticas
- ✅ Publicar posts en feed social

### 🛍️ **CLIENTE**
- ✅ Registrarse y crear perfil
- ✅ Buscar freelancers (filtro por skills, rating, precio)
- ✅ Ver perfil completo + portfolio + reviews de freelancers
- ✅ Crear "Proyecto" (job post)
- ✅ Recibir propuestas de freelancers
- ✅ Contratar servicios puntuales
- ✅ Ver historial de proyectos
- ✅ Dejar reviews después de completar proyecto
- ✅ Seguir freelancers
- ✅ Ver feed social

### 🔐 **ADMIN**
- ✅ Panel de control con analytics
- ✅ Verificar/Desverificar freelancers
- ✅ Moderar posts del feed
- ✅ Ver todas las transacciones
- ✅ Gestionar denuncias
- ✅ Eliminar perfiles fraudulentos
- ✅ Estadísticas de la plataforma

---

## 🛠️ FUNCIONALIDADES TÉCNICAS REQUERIDAS

### **Backend - Rutas Esenciales:**

```
AUTH:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/verify

USUARIOS:
GET /api/usuarios
GET /api/usuarios/:id
PUT /api/usuarios/:id (solo propio)
DELETE /api/usuarios/:id (solo Admin)
GET /api/usuarios/buscar?skills=react,node&minRating=4

SERVICIOS:
GET /api/servicios
GET /api/servicios/:id
POST /api/servicios (solo Freelancer)
PUT /api/servicios/:id (solo propietario)
DELETE /api/servicios/:id (solo propietario)

PROYECTOS:
GET /api/proyectos
GET /api/proyectos/:id
POST /api/proyectos (solo Cliente)
PUT /api/proyectos/:id/estado (solo propietario)
POST /api/proyectos/:id/propuestas (solo Freelancer)
PUT /api/proyectos/:id/asignar (solo Cliente)

PORTFOLIO:
GET /api/portfolio/:freelancer_id
POST /api/portfolio (solo Freelancer)
PUT /api/portfolio/:id (solo propietario)
DELETE /api/portfolio/:id (solo propietario)

REVIEWS:
POST /api/reviews (solo Cliente después de completar)
GET /api/reviews/:freelancer_id

POSTS:
GET /api/posts (feed)
POST /api/posts (cualquier usuario)
PUT /api/posts/:id (solo autor)
DELETE /api/posts/:id (solo autor o Admin)
POST /api/posts/:id/like
POST /api/posts/:id/comentarios

TRANSACCIONES:
GET /api/transacciones/:usuario_id (solo propio o Admin)
POST /api/transacciones
```

### **Frontend - Rutas:**

```
/ (Home/Landing)
/login
/register
/dashboard (según rol)
/explorar (buscar freelancers)
/perfil/:id
/perfil/editar
/mis-servicios (Freelancer)
/crear-servicio (Freelancer)
/mi-portfolio (Freelancer)
/crear-proyecto (Cliente)
/mis-proyectos
/proyectos/:id
/propuestas (Freelancer)
/transacciones
/reviews
/feed
/admin (Admin only)
/404
```

---

## 📊 DATOS INICIALES (Excel → CSV)

Necesitas crear un Excel con mínimo:
- **30-40 Usuarios** (mezcla de Freelancers, Clientes, 1-2 Admins)
- **50-60 Servicios**
- **30-40 Proyectos**
- **20-30 Transacciones**
- **15-20 Reviews**
- **20-25 Portfolio Items**
- **10-15 Posts**

Total: **100+ registros mínimo**

---

## 🌐 VARIABLES DE ENTORNO

### Backend (.env)
```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/devhub
JWT_SECRET=tu_jwt_secret_super_seguro
CLOUDINARY_NAME=tu_cloudinary_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🎨 REQUISITOS DE UX/UI

- ✅ Diseño limpio y profesional (tipo LinkedIn)
- ✅ Responsive (mobile-first)
- ✅ Navegación intuitiva
- ✅ Buscador avanzado con filtros
- ✅ Tarjetas de usuario/proyecto/servicio bien diseñadas
- ✅ Sistema de notificaciones visual
- ✅ Carga de imágenes smooth (Cloudinary)
- ✅ Formularios con validación
- ✅ Mensajes de error/éxito claros

---

## 📝 LIBRERIAS SUGERIDAS (Opcionales pero Recomendadas)

### Backend
- `express-validator` - Validación
- `multer` - Carga de archivos
- `cloudinary` - Gestión de imágenes
- `nodemailer` - Emails (opcional)
- `dotenv` - Variables de entorno

### Frontend
- `react-toastify` - Notificaciones
- `react-query` - Data fetching
- `react-icons` - Iconos
- `react-hook-form` - Formularios
- `zod` o `yup` - Validación
- `moment` o `date-fns` - Fechas
- `lodash` - Utilidades

---

## 🚀 PASOS PARA EMPEZAR

1. ✅ **Setup Backend:**
   - Crear proyecto Node.js
   - Instalar dependencias
   - Configurar MongoDB Atlas
   - Crear modelos Mongoose
   - Crear controllers y routes

2. ✅ **Setup Frontend:**
   - Crear proyecto Vite + React
   - Instalar dependencias
   - Configurar rutas (React Router)
   - Crear estructura de carpetas
   - Crear contexto de autenticación

3. ✅ **Crear datos (Excel/CSV):**
   - Hacer seeders desde CSV
   - Ejecutar seed.js

4. ✅ **Autenticación:**
   - Login/Register
   - JWT + Middleware
   - Protected routes

5. ✅ **Características principales:**
   - Perfil de usuario
   - Servicios
   - Proyectos
   - Portfolio

6. ✅ **Feed Social:**
   - Posts
   - Comentarios
   - Likes

7. ✅ **Sistema de Reviews:**
   - Dejar reviews
   - Calcular rating promedio

8. ✅ **Admin Panel:**
   - Moderación
   - Analytics

9. ✅ **Deploy:**
   - Frontend: Vercel
   - Backend: Railway/Render

---

## 📌 NOTAS IMPORTANTES

- **Arquitectura Clara**: Código limpio y bien estructurado
- **Validaciones**: Frontend + Backend
- **Seguridad**: Hasheado de contraseñas, JWT, protección de rutas
- **Error Handling**: Manejo correcto de errores
- **Responsive Design**: Mobile-friendly
- **Performance**: Lazy loading, optimización de imágenes
- **README**: Documentación completa explicando el proyecto

---

## ✨ PUNTOS EXTRA (Para destacar)

- Sistema de notificaciones en tiempo real (Socket.io)
- Chat directo entre usuario y freelancer
- Filtrado avanzado con búsqueda
- Badges/Achievements
- Sistema de "Endorsements" (como LinkedIn)
- Cartera/Wallet virtual
- Exportar portfolio como PDF
- Integraciones de pagos (Stripe/PayPal)

---

## 🎯 OBJETIVO FINAL

Una plataforma profesional, funcional y hermosa que **realmente funcione** y donde los usuarios puedan:
1. Crear un perfil creíble
2. Mostrar su trabajo real (portfolio con enlaces en vivo)
3. Conectar con otros developers
4. Encontrar trabajos o talento
5. Completar transacciones de manera segura

---

## 🎯 WORKFLOW ESTRUCTURADO PARA MÚLTIPLES AGENTES

### **Estructura de Equipos (3-4 Agentes)**

```
Agent 1: Backend Lead
├── Modelos MongoDB
├── Controllers
├── Routes
├── Middleware Auth
└── Seeds

Agent 2: Frontend Lead
├── Componentes principales
├── Páginas
├── Context/Estado
└── Servicios API

Agent 3: Integración/QA
├── Conectar Backend + Frontend
├── Testing E2E
├── Deploy
├── Documentación

(Opcional) Agent 4: Diseño/UX
├── Estilos CSS
├── Componentes reutilizables
└── Responsive design
```

---

### **Sistema de Documentación Compartida**

Crear archivo central `PROJECT_SPECS.md`:

```markdown
# DevHub Project Specifications

## 🔐 Estado del Proyecto
- [ ] Backend Setup
- [ ] Frontend Setup
- [ ] Data Seeds
- [x] Models Created
- [ ] Auth Implemented
- [ ] ...

## 📊 API Contracts (CRÍTICO)

### POST /api/auth/register
Request:
{
  "email": "string",
  "password": "string",
  "nombre": "string",
  "role": "Freelancer|Cliente|Admin"
}
Response (200):
{
  "token": "jwt_token",
  "usuario": { id, email, nombre, role }
}

### GET /api/usuarios/:id
Response (200):
{
  "_id": "...",
  "nombre": "string",
  "email": "string",
  "skills": [],
  "rating": { promedio, cantidad }
}

## 🚨 Reglas de Negocio CRÍTICAS

1. Solo Freelancers pueden crear Servicios
2. Solo Clientes pueden crear Proyectos
3. Solo Admin puede verificar freelancers
4. Reviews solo después de Proyecto completado
5. Transaccion solo cuando se asigna freelancer
```

---

### **Estrategia Git Branches**

```
main (producción - solo merged code)
│
├── develop (rama de integración principal)
│   │
│   ├── feature/backend-auth (Agent 1)
│   │   ├── feature/models-usuario
│   │   ├── feature/models-servicios
│   │   └── feature/auth-controller
│   │
│   ├── feature/frontend-auth (Agent 2)
│   │   ├── feature/login-page
│   │   ├── feature/register-page
│   │   └── feature/auth-context
│   │
│   ├── feature/database-seeds (Agent 1)
│   │   └── feature/seed-script
│   │
│   └── feature/integration-testing (Agent 3)
│       └── feature/e2e-tests

Workflow:
1. Cada agent crea su rama desde develop
2. Agent trabaja en su feature
3. Commit frecuentes: "feat(backend): description"
4. Pull request a develop con description clara
5. Code review por otro agent
6. Merge a develop cuando está listo
```

---

### **Planificación por Sprints (1-2 días cada uno)**

**SPRINT 1: Fundación**

Agent 1 (Backend):
```
Tasks:
- [ ] Proyecto Node.js + Express creado
- [ ] MongoDB conectado
- [ ] Crear modelo Usuario
- [ ] Crear modelo Servicio
- [ ] Crear modelo Proyecto
- [ ] Crear modelo Transaccion
- [ ] Crear modelo Review
- [ ] Crear modelo Portfolio
- [ ] Crear modelo Post

Entregable:
- feature/models branch con todos los modelos
- Archivo db.js configurado
- .env.example completo
```

Agent 2 (Frontend):
```
Tasks:
- [ ] Proyecto Vite + React creado
- [ ] React Router configurado
- [ ] Estructura de carpetas creada
- [ ] Componentes base (Navbar, Footer, Loading)
- [ ] AuthContext creado
- [ ] API client configurado (axios)
- [ ] Tailwind o Styled-Components setup

Entregable:
- feature/frontend-setup branch
- src/context/AuthContext.jsx
- src/services/api.js
- Componentes base funcionales
```

Agent 3 (Integración):
```
Tasks:
- [ ] API Contracts documentados en PROJECT_SPECS.md
- [ ] Crear PROGRESS.md
- [ ] Crear STANDUP.md
- [ ] Setup testing environment
- [ ] Backend seed.js structure
- [ ] .env templates para ambos

Entregable:
- PROJECT_SPECS.md completo
- PROGRESS.md inicial
- STANDUP.md template
- scripts de setup
```

---

### **Sistema de Comunicación**

**Daily Standup (actualizar diariamente en STANDUP.md):**

```markdown
## Day 1 - 2024-01-15

### Agent 1 (Backend)
✅ Hecho:
- Creados 7 modelos Mongoose
- Setup MongoDB Atlas

🔄 En progreso:
- Auth controller

🚫 Bloqueadores:
- Ninguno

📌 Próximo:
- Terminar auth controller
- Hacer seed.js

---

### Agent 2 (Frontend)
✅ Hecho:
- Proyecto Vite creado
- Routing configurado
- Navbar + Footer

🔄 En progreso:
- Auth Context

🚫 Bloqueadores:
- Esperando API contracts finales

📌 Próximo:
- Login/Register pages
- Integrar AuthContext

---

### Agent 3 (Integración)
✅ Hecho:
- API contracts documentados
- Estructura de testing

🔄 En progreso:
- Setup de CI/CD

🚫 Bloqueadores:
- Ninguno

📌 Próximo:
- Crear primer test E2E
- Setup de deploy en Railway/Vercel
```

---

### **Checkpoints y Validaciones**

**Después de cada Sprint, Agent 3 verifica:**

```javascript
✅ Backend
- [ ] Modelos validados correctamente
- [ ] Controllers implementados
- [ ] Routes funcionando en Postman
- [ ] Seed.js listo y testeable
- [ ] JWT middleware funciona
- [ ] Error handling implementado

✅ Frontend
- [ ] Proyecto compila sin errores
- [ ] Routing funciona
- [ ] Auth Context funciona
- [ ] API calls configuradas
- [ ] Responsive en móvil
- [ ] No hay console errors

✅ Integración
- [ ] API contracts actualizados
- [ ] Ambos equipos usan mismas estructuras
- [ ] Variables de entorno correctas
- [ ] Tests E2E pasando
- [ ] PROGRESS.md actualizado

// Si todo OK → ✅ MERGED a develop
// Si hay issues → 🔄 Feedback para ajustes
```

---

### **Tabla de Responsabilidades**

```
| Feature | Backend | Frontend | Integration | Notas |
|---------|---------|----------|-------------|-------|
| Auth | ✓ controller | ✓ pages | ✓ testing | Endpoint primero, luego UI |
| Usuarios | ✓ routes | ✓ profile | ✓ validar | Foto (Cloudinary después) |
| Servicios | ✓ CRUD | ✓ components | ✓ E2E | Modelo = Day 1 |
| Proyectos | ✓ CRUD | ✓ pages | ✓ testing | Incluye propuestas |
| Portfolio | ✓ rutas | ✓ galería | ✓ Cloudinary | Setup de upload |
| Reviews | ✓ modelo | ✓ component | ✓ validar | Solo después completado |
| Feed Social | ✓ CRUD | ✓ feed | ✓ testing | Post, comentarios, likes |
| Admin Panel | ✓ rutas | ✓ dashboard | ✓ testing | Último sprint |
| Deploy | ✓ Railway | ✓ Vercel | ✓ validar | Final |
```

---

### **Herramientas Recomendadas para Coordinar**

1. **GitHub Projects:** Kanban board con Sprint 1, 2, 3, In Progress, In Review, Done
2. **GitHub Issues:** Crear issue por feature, assignee a cada agent
3. **Ramas con nombres claros:** `feature/backend-auth`, `feature/frontend-login`, etc
4. **PRs descriptivos:** Descripción clara de qué cambia y por qué
5. **Code Reviews:** Otro agent revisa antes de merge
6. **Discussion Thread:** Para decisiones arquitectónicas importantes

---

### **Archivos Compartidos Esenciales**

```
devhub-proyecto/
├── 📄 README.md (visión general)
├── 📄 PROJECT_SPECS.md ⭐ (CRÍTICO - source of truth)
├── 📄 PROGRESS.md (estado actual % completado)
├── 📄 STANDUP.md (comunicación diaria)
├── 📄 API_CONTRACTS.md (endpoints exactos)
├── 📄 SETUP.md (guía para nuevos agentes)
├── 📄 DEPLOYMENT.md (instrucciones deploy)
├── 📁 docs/
│   ├── architecture.md
│   ├── database-schema.md
│   ├── auth-flow.md
│   └── testing-strategy.md
├── 📁 backend/
└── 📁 frontend/
```

---

### **Reglas de Oro para Múltiples Agentes**

1. **API Contracts PRIMERO**
   - Agent 3 documenta exactamente qué endpoint hace qué
   - Agent 1 implementa backend según spec
   - Agent 2 usa ese contrato exactamente

2. **Commits frecuentes y claros**
   ```bash
   ✅ git commit -m "feat(backend): add user authentication"
   ✅ git commit -m "fix(frontend): auth context hook"
   ❌ git commit -m "updates"
   ```

3. **PRs pequeños y específicos**
   - PR 1: Modelo Usuario
   - PR 2: Auth Controller
   - PR 3: Protected Routes Middleware
   - NO: Todo junto en un mega-PR

4. **Documentar mientras haces**
   - Actualizar PROJECT_SPECS.md si cambias algo
   - Comentar código complejo
   - Explicar decisiones en el PR

5. **Testing antes de merge**
   - Agent testa localmente su código
   - Agent 3 hace testing E2E
   - Solo ENTONCES merge a develop

---

### **Workflow Diario**

**Mañana: Planificación**
```
1. Agent 3 abre/actualiza GitHub Project
2. Cada agent toma sus tasks
3. 5 min async standup (escriben en STANDUP.md)
4. EMPIEZAN EN PARALELO
```

**Medio Día: Check-in**
```
1. Cada agent hace su primer commit
2. Agent 3 revisa que siga los specs
3. Feedback inmediato si hay divergencias
4. Continúan iterando
```

**Tarde: Integración**
```
1. Agent 3 revisa PRs completadas
2. Code review rápido
3. Merge a develop si OK
4. Actualizar PROGRESS.md
5. Preparar próximas tareas
```

**Noche: Preparar mañana**
```
1. Agent 3 documenta estado
2. Identifica bloqueadores
3. Prepara tasks para mañana
4. Update en STANDUP.md
```

---

### **Óptimo de Agentes para DevHub**

- **Mínimo 2:** Backend + Frontend (menos eficiente, más conflictos)
- **Óptimo 3:** Backend + Frontend + Integration (recomendado)
- **Máximo 4:** + Designer/UX (si quieres UI/UX perfecto)

---

**¡LISTO PARA EMPEZAR! 🚀**

Ahora copia este prompt a Claude Code y dile que comience con el Backend.
