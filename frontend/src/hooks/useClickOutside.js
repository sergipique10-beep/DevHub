import { useEffect, useRef } from "react";

/**
 * Devuelve una ref para el contenedor y ejecuta `alCerrar` cuando el usuario
 * hace click fuera de él o pulsa Escape.
 *
 * Los listeners solo se registran mientras `activo` es true, para no dejar
 * escuchando al documento un menú que está cerrado.
 */
export const useClickOutside = (activo, alCerrar) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!activo) return undefined;

    const alClickFuera = (e) => {
      if (ref.current && !ref.current.contains(e.target)) alCerrar("click");
    };
    const alPulsarTecla = (e) => {
      if (e.key === "Escape") alCerrar("escape");
    };

    document.addEventListener("mousedown", alClickFuera);
    document.addEventListener("keydown", alPulsarTecla);
    return () => {
      document.removeEventListener("mousedown", alClickFuera);
      document.removeEventListener("keydown", alPulsarTecla);
    };
  }, [activo, alCerrar]);

  return ref;
};

export default useClickOutside;
