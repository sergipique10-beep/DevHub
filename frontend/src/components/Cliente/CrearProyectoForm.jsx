import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import proyectoService from "../../services/proyectoService";
import useMutacion from "../../hooks/useMutacion";
import { proyectoSchema } from "../../schemas";
import { listaDesde } from "../../utils/parse";
import { Form, FormGroup, Label, Input, TextArea, ErrorText, Button } from "../../styles/ui";

const CrearProyectoForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(proyectoSchema) });

  const mutation = useMutacion({
    mutationFn: (payload) => proyectoService.create(payload),
    exito: "Proyecto publicado",
    invalidar: [["proyectos"]],
    onSuccess: (proyecto) => navigate(`/proyectos/${proyecto._id}`),
  });

  const onSubmit = (datos) => {
    mutation.mutate({
      ...datos,
      tecnologiasRequeridas: listaDesde(datos.tecnologiasRequeridas),
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label htmlFor="titulo">Título</Label>
        <Input id="titulo" {...register("titulo")} />
        {errors.titulo && <ErrorText>{errors.titulo.message}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="descripcion">Descripción</Label>
        <TextArea id="descripcion" {...register("descripcion")} />
        {errors.descripcion && <ErrorText>{errors.descripcion.message}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="presupuesto">Presupuesto (€)</Label>
        <Input id="presupuesto" type="number" step="0.01" {...register("presupuesto")} />
        {errors.presupuesto && <ErrorText>{errors.presupuesto.message}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="deadline">Fecha límite</Label>
        <Input id="deadline" type="date" {...register("deadline")} />
        {errors.deadline && <ErrorText>{errors.deadline.message}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="tecnologiasRequeridas">Tecnologías requeridas (separadas por ;)</Label>
        <Input id="tecnologiasRequeridas" placeholder="react;node;mongodb" {...register("tecnologiasRequeridas")} />
      </FormGroup>

      <Button type="submit" disabled={isSubmitting || mutation.isPending}>
        Publicar proyecto
      </Button>
    </Form>
  );
};

export default CrearProyectoForm;
