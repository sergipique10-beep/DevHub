export const listaDesde = (valor, separador = ";") =>
  valor
    ? valor
        .split(separador)
        .map((v) => v.trim())
        .filter(Boolean)
    : [];

export const listaHacia = (lista, separador = ";") => (lista || []).join(separador);

export const parsearSkills = (valor) =>
  listaDesde(valor).map((par) => {
    const [nombre, nivel] = par.split(":").map((v) => v.trim());
    return { nombre, nivel: Number(nivel) || 1 };
  });

export const skillsHacia = (skills) =>
  (skills || []).map((s) => `${s.nombre}:${s.nivel}`).join(";");

export const formatearFecha = (fecha) => {
  if (!fecha) return "";
  return new Date(fecha).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const aInputDate = (fecha) => {
  if (!fecha) return "";
  return new Date(fecha).toISOString().slice(0, 10);
};
