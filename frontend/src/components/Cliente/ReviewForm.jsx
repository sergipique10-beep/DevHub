import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import reviewService from "../../services/reviewService";
import { reviewSchema } from "../../schemas";
import { Form, FormGroup, Label, Input, TextArea, Select, ErrorText, Button, Flex } from "../../styles/ui";

const estrellasOptions = [1, 2, 3, 4, 5];

const ReviewForm = ({ proyectoId, freelancerId }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { puntuacion: 5, comunicacion: 5, calidad: 5, puntualidad: 5 },
  });

  const mutation = useMutation({
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", freelancerId] });
      queryClient.invalidateQueries({ queryKey: ["proyecto", proyectoId] });
      toast.success("Review enviada, gracias por tu feedback");
    },
    onError: (error) => toast.error(error.message),
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
        <FormGroup style={{ flex: 1 }}>
          <Label htmlFor="comunicacion">Comunicación</Label>
          <Input id="comunicacion" type="number" min="1" max="5" {...register("comunicacion")} />
        </FormGroup>
        <FormGroup style={{ flex: 1 }}>
          <Label htmlFor="calidad">Calidad</Label>
          <Input id="calidad" type="number" min="1" max="5" {...register("calidad")} />
        </FormGroup>
        <FormGroup style={{ flex: 1 }}>
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
