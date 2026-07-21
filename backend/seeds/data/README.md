# Datos semilla (CSV)

Coloca aquí los 7 archivos CSV exportados desde tu Excel. `seeds/seed.js` los lee con `fs`
y los inserta en MongoDB **en este orden** (algunos archivos referencian filas de los
anteriores mediante columnas `*_email` o `*_titulo`, ya que los `_id` de Mongo no existen
hasta que se insertan):

1. `usuarios.csv`
2. `servicios.csv`
3. `proyectos.csv`
4. `portfolio.csv`
5. `posts.csv`
6. `transacciones.csv`
7. `reviews.csv`

Si falta algún archivo, el seed muestra un aviso y simplemente omite esa colección
(no falla). Cada fila que no pueda resolver sus relaciones (p. ej. un email que no
existe en `usuarios.csv`) se omite con un aviso en consola.

Ejecutar con: `npm run seed` (desde `backend/`, con `MONGODB_URI` configurado en `.env`).

## Listas y sub-objetos dentro de una celda

Como el CSV usa comas para separar columnas, las listas dentro de una celda se separan
con `;`. Para `skills` (nombre + nivel) se usa `nombre:nivel` separados por `;`.

Ejemplo celda `skills`: `JavaScript:5;React:4;Node.js:4`
Ejemplo celda `tags` o `tecnologias`: `react;node;mongodb`

## 1. usuarios.csv

| columna | tipo | notas |
|---|---|---|
| email | string | único, clave natural usada por el resto de CSVs |
| password | string | texto plano en el CSV; el modelo lo hashea al insertar |
| nombre | string | |
| apellido | string | |
| role | `Admin` \| `Freelancer` \| `Cliente` | |
| fotoPerfil | string | URL, opcional |
| bio | string | opcional |
| ubicacion | string | opcional |
| github | string | opcional |
| linkedin | string | opcional |
| portfolio | string | opcional (URL de portfolio externo) |
| skills | string | `nombre:nivel;nombre:nivel` (nivel 1-5), opcional |
| experiencia_años | number | opcional |
| experiencia_descripcion | string | opcional |
| verificado | `true`/`false` | opcional, default false |

Recomendado: 30-40 filas, mezcla de Freelancer/Cliente y 1-2 Admin.

## 2. servicios.csv

| columna | tipo | notas |
|---|---|---|
| freelancer_email | string | debe existir en usuarios.csv |
| titulo | string | junto con freelancer_email forma la clave usada por transacciones.csv |
| descripcion | string | |
| categoria | string | |
| precioBase | number | |
| tiempoEntrega | number | días |
| imagenPrincipal | string | URL, opcional |
| tags | string | `react;node;...`, opcional |

Recomendado: 50-60 filas.

## 3. proyectos.csv

| columna | tipo | notas |
|---|---|---|
| cliente_email | string | debe existir en usuarios.csv |
| titulo | string | junto con cliente_email forma la clave usada por transacciones.csv y reviews.csv |
| descripcion | string | |
| presupuesto | number | |
| deadline | fecha `YYYY-MM-DD` | |
| estado | `Abierto`\|`En progreso`\|`Completado`\|`Cancelado` | opcional, default Abierto |
| tecnologiasRequeridas | string | `react;node;...`, opcional |
| freelancer_asignado_email | string | opcional; debe existir en usuarios.csv si se indica |

Recomendado: 30-40 filas. Para poder generar reviews de prueba, incluye varios proyectos
con `estado=Completado` y `freelancer_asignado_email` relleno.

## 4. portfolio.csv

| columna | tipo | notas |
|---|---|---|
| freelancer_email | string | debe existir en usuarios.csv |
| titulo | string | |
| descripcion | string | |
| imagenes | string | URLs separadas por `;`, opcional |
| enlaceProyecto | string | URL demo en vivo, opcional |
| repositorioGithub | string | URL del repo, opcional |
| tecnologias | string | `react;node;...`, opcional |
| featured | `true`/`false` | opcional |

Recomendado: 20-25 filas.

## 5. posts.csv

| columna | tipo | notas |
|---|---|---|
| autor_email | string | debe existir en usuarios.csv |
| contenido | string | |
| imagen | string | URL, opcional |

Recomendado: 10-15 filas.

## 6. transacciones.csv

| columna | tipo | notas |
|---|---|---|
| cliente_email | string | debe existir en usuarios.csv |
| freelancer_email | string | debe existir en usuarios.csv |
| proyecto_titulo | string | opcional; debe coincidir con un `titulo` de proyectos.csv del mismo `cliente_email` |
| servicio_titulo | string | opcional; debe coincidir con un `titulo` de servicios.csv del mismo `freelancer_email` |
| monto | number | |
| estado | `Pendiente`\|`Completada`\|`Reembolsada` | opcional, default Pendiente |
| metodoPago | string | |
| fecha | fecha `YYYY-MM-DD` | opcional, default hoy |

Recomendado: 20-30 filas.

## 7. reviews.csv

| columna | tipo | notas |
|---|---|---|
| autor_email | string | el cliente que deja la review; debe existir en usuarios.csv |
| freelancer_email | string | debe existir en usuarios.csv |
| proyecto_titulo | string | debe coincidir con un `titulo` de proyectos.csv del mismo `autor_email` (como `cliente_email`) |
| puntuacion | number 1-5 | |
| comentario | string | |
| aspecto_comunicacion | number 1-5 | |
| aspecto_calidad | number 1-5 | |
| aspecto_puntualidad | number 1-5 | |

Recomendado: 15-20 filas. El seed recalcula automáticamente `rating.promedio` y
`rating.cantidad` de cada freelancer a partir de sus reviews.
