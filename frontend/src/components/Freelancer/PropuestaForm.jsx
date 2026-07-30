import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import proyectoService from "../../services/proyectoService";
import useMutacion from "../../hooks/useMutacion";
import { propuestaSchema } from "../../schemas";
import { Form, FormGroup, Label, Input, TextArea, ErrorText, Button } from "../../styles/ui";

const PropuestaForm = ({ proyectoId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(propuestaSchema) });

  const mutation = useMutacion({
    mutationFn: (payload) => proyectoService.enviarPropuesta(proyectoId, payload),
    exito: "Propuesta enviada",
    invalidar: [["proyecto", proyectoId], ["proyectos"]],
  });

  return (
    <Form onSubmit={handleSubmit((datos) => mutation.mutate(datos))}>
      <FormGroup>
        <Label htmlFor="precio">Tu precio (€)</Label>
        <Input id="precio" type="number" step="0.01" {...register("precio")} />
        {errors.precio && <ErrorText>{errors.precio.message}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="mensaje">Mensaje</Label>
        <TextArea id="mensaje" {...register("mensaje")} />
        {errors.mensaje && <ErrorText>{errors.mensaje.message}</ErrorText>}
      </FormGroup>

      <Button type="submit" disabled={isSubmitting || mutation.isPending}>
        Enviar propuesta
      </Button>
    </Form>
  );
};

export default PropuestaForm;
