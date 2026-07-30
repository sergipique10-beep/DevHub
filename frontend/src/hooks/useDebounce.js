import { useEffect, useState } from "react";

/**
 * Retrasa la propagación de un valor hasta que deja de cambiar durante `retardo` ms.
 *
 * Se usa para que los filtros de búsqueda disparen la query mientras el usuario
 * escribe sin lanzar una petición por cada tecla.
 */
export const useDebounce = (valor, retardo = 400) => {
  const [valorRetrasado, setValorRetrasado] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setValorRetrasado(valor), retardo);
    return () => clearTimeout(temporizador);
  }, [valor, retardo]);

  return valorRetrasado;
};

export default useDebounce;
