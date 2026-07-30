/** Estados posibles de un proyecto, en el orden del ciclo de vida. */
export const ESTADOS_PROYECTO = ["Abierto", "En progreso", "Completado", "Cancelado"];

/** Tono del Badge para cada estado. Estaba duplicado en 4 componentes. */
export const TONO_ESTADO = {
  Abierto: "primary",
  "En progreso": "warning",
  Completado: "success",
  Cancelado: "danger",
};
