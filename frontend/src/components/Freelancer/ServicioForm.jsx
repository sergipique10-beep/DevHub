import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import servicioService from "../../services/servicioService";
import useMutacion from "../../hooks/useMutacion";
import { servicioSchema } from "../../schemas";
import { listaDesde, listaHacia } from "../../utils/parse";
import { Form, FormGroup, Label, Input, TextArea, Select, ErrorText, Button, Flex } from "../../styles/ui";

const categorias = [
  "Desarrollo Web",
  "Desarrollo Movil",
  "Backend",
  "Frontend",
  "DevOps",
  "Diseno UI/UX",
  "Consultoria Tecnica",
  "Ciberseguridad",
  "Data Science",
  "QA/Testing",
];

const ServicioForm = ({ servicio, onSuccess, onCancel }) => {
  const editando = Boolean(servicio);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(servicioSchema),
    defaultValues: servicio
      ? {
          titulo: servicio.titulo,
          descripcion: servicio.descripcion,
          categoria: servicio.categoria,
          precioBase: servicio.precioBase,
          tiempoEntrega: servicio.tiempoEntrega,
          imagenPrincipal: servicio.imagenPrincipal || "",
          tags: listaHacia(servicio.tags),
        }
      : { categoria: categorias[0] },
  });

  const mutation = useMutacion({
    mutationFn: (payload) =>
      editando ? servicioService.update(servicio._id, payload) : servicioService.create(payload),
    exito: editando ? "Servicio actualizado" : "Servicio creado",
    invalidar: [["servicios"]],
    onSuccess: () => onSuccess?.(),
  });

  const onSubmit = (datos) => {
    mutation.mutate({ ...datos, tags: listaDesde(datos.tags) });
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
        <Label htmlFor="categoria">Categoría</Label>
        <Select id="categoria" {...register("categoria")}>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </FormGroup>

      <Flex $gap={2}>
        <FormGroup $flex="1">
          <Label htmlFor="precioBase">Precio base (€)</Label>
          <Input id="precioBase" type="number" step="0.01" {...register("precioBase")} />
          {errors.precioBase && <ErrorText>{errors.precioBase.message}</ErrorText>}
        </FormGroup>

        <FormGroup $flex="1">
          <Label htmlFor="tiempoEntrega">Entrega (días)</Label>
          <Input id="tiempoEntrega" type="number" {...register("tiempoEntrega")} />
          {errors.tiempoEntrega && <ErrorText>{errors.tiempoEntrega.message}</ErrorText>}
        </FormGroup>
      </Flex>

      <FormGroup>
        <Label htmlFor="imagenPrincipal">URL de imagen principal</Label>
        <Input id="imagenPrincipal" placeholder="https://..." {...register("imagenPrincipal")} />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="tags">Tags (separados por ;)</Label>
        <Input id="tags" placeholder="react;node;mongodb" {...register("tags")} />
      </FormGroup>

      <Flex $gap={1}>
        <Button type="submit" disabled={isSubmitting || mutation.isPending}>
          {editando ? "Guardar cambios" : "Publicar servicio"}
        </Button>
        {onCancel && (
          <Button type="button" $variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </Flex>
    </Form>
  );
};

export default ServicioForm;
