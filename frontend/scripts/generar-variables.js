/**
 * Genera src/styles/variables.css a partir de los tokens de theme.js.
 *
 * El CSS se commitea (para poder abrirlo y leerlo), pero no se edita a mano:
 * theme.js es la única fuente de verdad y este script proyecta sus valores.
 * Si tocas un token, ejecuta `npm run tokens` para regenerar el archivo.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { variablesCSS } from "../src/styles/theme.js";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const DESTINO = join(RAIZ, "src", "styles", "variables.css");

const contenido = `/*
 * Variables de diseño: colores, espaciados, radios, sombras y tipografía.
 *
 * ARCHIVO GENERADO — no lo edites a mano.
 * Fuente: src/styles/theme.js · Regenerar: npm run tokens
 */

:root {
  ${variablesCSS()}
}
`;

writeFileSync(DESTINO, contenido, "utf-8");

const total = contenido.match(/^\s*--/gm)?.length ?? 0;
console.log(`variables.css generado con ${total} variables`);
