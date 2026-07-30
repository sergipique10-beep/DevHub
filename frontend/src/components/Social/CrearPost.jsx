import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import postService from "../../services/postService";
import useMutacion from "../../hooks/useMutacion";
import { postSchema } from "../../schemas";
import styled from "styled-components";
import { Form, FormGroup, TextArea, Input, ErrorText, Button } from "../../styles/ui";

const Enviar = styled(Button)`
  align-self: flex-end;
`;

const CrearPost = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(postSchema) });

  const mutation = useMutacion({
    mutationFn: (datos) => postService.create(datos),
    invalidar: [["posts"]],
    onSuccess: () => reset(),
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
      <Enviar type="submit" disabled={isSubmitting || mutation.isPending}>
        Publicar
      </Enviar>
    </Form>
  );
};

export default CrearPost;
