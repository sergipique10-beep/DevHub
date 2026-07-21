import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import postService from "../../services/postService";
import { postSchema } from "../../schemas";
import { Form, FormGroup, TextArea, Input, ErrorText, Button } from "../../styles/ui";

const CrearPost = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(postSchema) });

  const mutation = useMutation({
    mutationFn: (datos) => postService.create(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      reset();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Form onSubmit={handleSubmit((datos) => mutation.mutate(datos))}>
      <FormGroup>
        <TextArea placeholder="¿Qué estás construyendo hoy?" {...register("contenido")} />
        {errors.contenido && <ErrorText>{errors.contenido.message}</ErrorText>}
      </FormGroup>
      <FormGroup>
        <Input placeholder="URL de imagen (opcional)" {...register("imagen")} />
      </FormGroup>
      <Button type="submit" disabled={isSubmitting || mutation.isPending} style={{ alignSelf: "flex-end" }}>
        Publicar
      </Button>
    </Form>
  );
};

export default CrearPost;
