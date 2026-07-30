import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import portfolioService from "../../services/portfolioService";
import useMutacion from "../../hooks/useMutacion";
import { portfolioSchema } from "../../schemas";
import { listaDesde, listaHacia } from "../../utils/parse";
import { Form, FormGroup, Label, Input, TextArea, ErrorText, Button, Flex } from "../../styles/ui";

const PortfolioForm = ({ item, onSuccess, onCancel }) => {
  const editando = Boolean(item);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(portfolioSchema),
    defaultValues: item
      ? {
          titulo: item.titulo,
          descripcion: item.descripcion,
          imagenes: listaHacia(item.imagenes),
          enlaceProyecto: item.enlaceProyecto || "",
          repositorioGithub: item.repositorioGithub || "",
          tecnologias: listaHacia(item.tecnologias),
        }
      : {},
  });

  const mutation = useMutacion({
    mutationFn: (payload) =>
      editando ? portfolioService.update(item._id, payload) : portfolioService.create(payload),
    exito: editando ? "Proyecto actualizado" : "Proyecto añadido al portfolio",
    invalidar: [["portfolio"]],
    onSuccess: () => onSuccess?.(),
  });

  const onSubmit = (datos) => {
    mutation.mutate({
      ...datos,
      imagenes: listaDesde(datos.imagenes),
      tecnologias: listaDesde(datos.tecnologias),
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
        <Label htmlFor="imagenes">URLs de imágenes (separadas por ;)</Label>
        <Input id="imagenes" placeholder="https://.../1.png;https://.../2.png" {...register("imagenes")} />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="enlaceProyecto">Demo en vivo</Label>
        <Input id="enlaceProyecto" placeholder="https://..." {...register("enlaceProyecto")} />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="repositorioGithub">Repositorio GitHub</Label>
        <Input id="repositorioGithub" placeholder="https://github.com/..." {...register("repositorioGithub")} />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="tecnologias">Tecnologías (separadas por ;)</Label>
        <Input id="tecnologias" placeholder="react;node;mongodb" {...register("tecnologias")} />
      </FormGroup>

      <Flex $gap={1}>
        <Button type="submit" disabled={isSubmitting || mutation.isPending}>
          {editando ? "Guardar cambios" : "Añadir al portfolio"}
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

export default PortfolioForm;
