# Rediseño del navbar y logo de marca — DevHub

**Fecha:** 2026-07-30
**Estado:** Aprobado

## Problema

El navbar actual ([frontend/src/components/common/Navbar.jsx](../../../frontend/src/components/common/Navbar.jsx)) tiene tres carencias:

1. **Sin identidad de marca.** El "logo" es `FiCode`, un icono genérico de react-icons, indistinguible del de cualquier otra app.
2. **Saturación.** Con rol Freelancer se renderizan 7 enlaces + nombre de usuario + botón "Salir" en una sola fila dentro de un contenedor de 1100px. Los enlaces se comprimen y la jerarquía visual desaparece.
3. **Zona de cuenta pobre.** El usuario aparece como un enlace de texto con su nombre, pese a existir ya un componente `Avatar` en el proyecto.

## Objetivo

Un navbar con marca propia, jerarquía clara entre navegación y cuenta, y acabado acorde al estilo glassmorphism oscuro que ya define `theme.js`.

## Fuera de alcance

- Cambios en `theme.js`. Todo el diseño sale de los tokens existentes.
- Rediseño del `Footer`, `AuthLayout` u otras pantallas. El nuevo `Logo` queda disponible para ellas, pero integrarlo ahí es trabajo aparte.
- Cambios en rutas, permisos o lógica de autenticación.

## Arquitectura

Tres componentes, cada uno con una responsabilidad:

| Componente | Archivo | Responsabilidad |
|---|---|---|
| `Logo` | `frontend/src/components/common/Logo.jsx` (nuevo) | Renderizar la marca. Sin estado, sin dependencias de contexto. |
| `UserMenu` | `frontend/src/components/common/UserMenu.jsx` (nuevo) | Zona de cuenta en escritorio: avatar, nombre y dropdown. Gestiona su propio estado de apertura. |
| `Navbar` | `frontend/src/components/common/Navbar.jsx` (reescrito) | Decide qué zonas se pintan según sesión y ruta. Gestiona el estado de scroll y del panel móvil. |

`Navbar` no conoce el estado interno del dropdown; `UserMenu` no conoce el layout de la barra. La única entrada de `UserMenu` es el objeto `usuario` y un callback `onLogout`.

## Componentes

### Logo

SVG original. La marca es un **hexágono de esquinas redondeadas** —idea de *hub*, de nodo en una red— que contiene una **"D" abierta formada por dos trazos angulares** que evocan un chevron `</>`, con un punto-nodo en el centro.

- Relleno mediante `<linearGradient>` con los mismos stops que `theme.gradient.primary`: `#22d3ee` (0%) → `#3b82f6` (55%) → `#a855f7` (100%).
- El `id` del gradiente se genera con `useId()` de React. Sin esto, dos instancias del logo en la misma página colisionarían en el DOM y la segunda heredaría el gradiente de la primera.
- Props:
  - `size` (number, por defecto `30`) — lado del SVG en píxeles.
  - `showWordmark` (boolean, por defecto `true`) — si se pinta el texto "DevHub" junto a la marca, usando el `GradientText` de `styles/ui`.
- Sin estado. El glow de hover lo aplica el contenedor que lo usa, no el propio `Logo`.

### UserMenu

Botón disparador: `Avatar` de 32px + nombre del usuario + chevron que rota 180° al abrir.

Contenido del dropdown, en este orden:

1. Mi perfil → `/perfil/editar`
2. Mis servicios → `/mis-servicios` *(solo rol Freelancer)*
3. Portfolio → `/mi-portfolio` *(solo rol Freelancer)*
4. Publicar proyecto → `/crear-proyecto` *(solo rol Cliente)*
5. Proyectos → `/mis-proyectos`
6. Admin → `/admin` *(solo rol Admin)*
7. — separador —
8. Salir (acción, no enlace)

Comportamiento de cierre, los tres casos:

- Click fuera del menú: listener `mousedown` en `document`, registrado solo mientras está abierto, comparando contra un `ref` del contenedor.
- Tecla `Escape`: devuelve el foco al botón disparador.
- Cambio de ruta: efecto sobre `pathname` de `useLocation`.

Accesibilidad: el disparador lleva `aria-haspopup="menu"` y `aria-expanded`; el panel lleva `role="menu"` y cada entrada `role="menuitem"`. Los estados de foco son visibles.

### Navbar

Tres zonas en una fila: **Marca** (izquierda) · **Navegación** (a continuación de la marca) · **Cuenta** (derecha, con `margin-left: auto`).

Navegación, siempre visible salvo en `/login` y `/register`:

- Explorar → `/explorar`
- Feed → `/feed`
- Dashboard → `/dashboard` *(solo con sesión)*

Zona de cuenta:

- Con sesión: `UserMenu`.
- Sin sesión: enlace "Entrar" + botón gradiente "Registrarse".

La condición `esPaginaAuth` se mantiene tal cual: en `/login` y `/register` solo se pinta la marca.

## Micro-interacciones

- **Scroll.** Un listener `scroll` (pasivo) marca la barra como `scrolled` al superar los 8px. En ese estado la altura pasa de 68px a 58px y aumentan la opacidad del fondo y la sombra. Transición de 0.25s.
- **Enlace activo.** Pastilla de fondo tenue (`primaryLight`) más una barra inferior de 2px con `gradient.primary` que se expande desde el centro mediante `transform: scaleX()`.
- **Hover en enlace inactivo.** El color pasa de `textMuted` a `text` y aparece un fondo apenas perceptible.
- **Dropdown.** Entrada con `opacity` 0→1 y `translateY` de -6px a 0, en 0.16s.
- **Logo.** `drop-shadow` de glow cian que se intensifica al hover del contenedor de marca.
- **Movimiento reducido.** Bajo `@media (prefers-reduced-motion: reduce)` todas las transiciones y transformaciones anteriores se anulan; los estados finales (color, fondo, opacidad) se mantienen.

## Móvil

Por debajo del breakpoint `media.mobile` (768px), la navegación y la zona de cuenta se ocultan y aparece el botón hamburguesa. El panel desplegable se estructura así:

1. **Cabecera de usuario** (solo con sesión): avatar de 44px, nombre y rol.
2. **Sección "Navegación"**: los enlaces públicos.
3. **Sección "Mi cuenta"**: las entradas que en escritorio viven en el dropdown, incluida "Salir".

Sin dropdown anidado: en móvil todo aparece desplegado. Cada sección lleva un rótulo en mayúsculas pequeñas sobre `textMuted`.

Sin sesión, el panel muestra solo la navegación pública más "Entrar" y "Registrarse".

## Manejo de errores

El navbar no hace peticiones de red, así que no hay estados de error propios. Los dos casos degradados a cubrir:

- `usuario` sin `nombre` o sin `fotoPerfil`: `Avatar` ya cubre ambos —cae a la inicial del nombre, y a cadena vacía si no hay nombre—. No se añade lógica extra.
- `usuario.role` con un valor inesperado: los bloques por rol son condicionales aditivos, de modo que un rol desconocido simplemente ve el conjunto común (Mi perfil, Proyectos, Salir). No se rompe.

## Verificación

El frontend no tiene infraestructura de tests, así que la verificación es manual:

1. `npm run build` en `frontend/` termina sin errores ni warnings nuevos.
2. Revisión visual en escritorio para los cuatro estados de sesión: sin sesión, Cliente, Freelancer y Admin. En cada uno, comprobar que el dropdown contiene exactamente las entradas que le corresponden.
3. Revisión visual en móvil (ancho 375px) para los mismos cuatro estados.
4. Comprobar los tres modos de cierre del dropdown: click fuera, `Escape` y navegación a otra ruta.
5. Comprobar que en `/login` y `/register` solo aparece la marca.
6. Navegación con teclado: `Tab` recorre marca → enlaces → menú de usuario, con foco visible en todos.
