import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

/**
 * Envuelve `useMutation` con lo que todas las mutaciones de la app repetían:
 * toast de éxito, toast de error y invalidación de las queries afectadas.
 *
 * @param {Function}  mutationFn  Llamada al servicio.
 * @param {string}    exito       Mensaje del toast de éxito. Si se omite, no se muestra.
 * @param {Array}     invalidar   Lista de queryKeys a invalidar tras el éxito.
 * @param {Function}  onSuccess   Efecto extra (navegar, resetear el form...). Recibe
 *                                los mismos argumentos que el onSuccess de React Query.
 */
export const useMutacion = ({ mutationFn, exito, invalidar = [], onSuccess }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (...args) => {
      invalidar.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
      if (exito) toast.success(exito);
      onSuccess?.(...args);
    },
    onError: (error) => toast.error(error.message),
  });
};

export default useMutacion;
