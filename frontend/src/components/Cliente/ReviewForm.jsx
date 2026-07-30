import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import reviewService from "../../services/reviewService";
import useMutacion from "../../hooks/useMutacion";
import { reviewSchema } from "../../schemas";
import { Form, FormGroup, Label, Input, TextArea, Select, ErrorText, Button, Flex } from "../../styles/ui";

const estrellasOptions = [1, 2, 3, 4, 5];

const ReviewForm = ({ proyectoId, freelancerId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { puntuacion: 5, comunicacion: 5, calidad: 5, puntualidad: 5 },
  });

  const mutation = useMutacion({
    mutationFn: (datos) =>
      reviewService.create({
        proyecto_id: proyectoId,
        puntuacion: datos.puntuacion,
        comentario: datos.comentario,
        aspectos: {
          comunicacion: datos.comunicacion,
          calidad: datos.calidad,
          puntualidad: datos.puntualidad,
        },
      }),
    exito: "Review enviada, gracias por tu feedback",
    invalidar: [["reviews", freelancerId], ["proyecto", proyectoId]],
  });

  return (
    <Form onSubmit={handleSubmit((datos) => mutation.mutate(datos))}>
      <FormGroup>
        <Label htmlFor="puntuacion">Puntuación general</Label>
        <Select id="puntuacion" {...register("puntuacion")}>
          {estrellasOptions.map((n) => (
            <option key={n} value={n}>
              {n} estrella{n > 1 ? "s" : ""}
            </option>
          ))}
        </Select>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="comentario">Comentario</Label>
        <TextArea id="comentario" {...register("comentario")} />
        {errors.comentario && <ErrorText>{errors.comentario.message}</ErrorText>}
      </FormGroup>

      <Flex $gap={2}>
        <FormGroup $flex="1">
          <Label htmlFor="comunicacion">Comunicación</Label>
          <Input id="comunicacion" type="number" min="1" max="5" {...register("comunicacion")} />
        </FormGroup>
        <FormGroup $flex="1">
          <Label htmlFor="calidad">Calidad</Label>
          <Input id="calidad" type="number" min="1" max="5" {...register("calidad")} />
        </FormGroup>
        <FormGroup $flex="1">
          <Label htmlFor="puntualidad">Puntualidad</Label>
          <Input id="puntualidad" type="number" min="1" max="5" {...register("puntualidad")} />
        </FormGroup>
      </Flex>

      <Button type="submit" disabled={isSubmitting || mutation.isPending}>
        Enviar review
      </Button>
    </Form>
  );
};

export default ReviewForm;
