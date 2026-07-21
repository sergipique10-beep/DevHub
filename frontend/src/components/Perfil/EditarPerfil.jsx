import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import usuarioService from "../../services/usuarioService";
import { useAuth } from "../../context/AuthContext";
import { perfilSchema } from "../../schemas";
import { parsearSkills, skillsHacia } from "../../utils/parse";
import { Form, FormGroup, Label, Input, TextArea, ErrorText, Button } from "../../styles/ui";
import Loading from "../common/Loading";

const EditarPerfil = () => {
  const { usuario: sesion } = useAuth();
  const queryClient = useQueryClient();

  const { data: usuario, isLoading } = useQuery({
    queryKey: ["usuario", sesion.id],
    queryFn: () => usuarioService.getById(sesion.id),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(perfilSchema),
    values: usuario
      ? {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          bio: usuario.bio || "",
          ubicacion: usuario.ubicacion || "",
          fotoPerfil: usuario.fotoPerfil || "",
          github: usuario.enlaces?.github || "",
          linkedin: usuario.enlaces?.linkedin || "",
          portfolio: usuario.enlaces?.portfolio || "",
          skills: skillsHacia(usuario.skills),
          experiencia_años: usuario.experiencia?.años || 0,
          experiencia_descripcion: usuario.experiencia?.descripcion || "",
        }
      : undefined,
  });

  if (isLoading) return <Loading />;

  const onSubmit = async (datos) => {
    try {
      const payload = {
        nombre: datos.nombre,
        apellido: datos.apellido,
        bio: datos.bio,
        ubicacion: datos.ubicacion,
        fotoPerfil: datos.fotoPerfil,
        enlaces: {
          github: datos.github,
          linkedin: datos.linkedin,
          portfolio: datos.portfolio,
        },
      };

      if (sesion.role === "Freelancer") {
        payload.skills = parsearSkills(datos.skills);
        payload.experiencia = {
          años: datos.experiencia_años,
          descripcion: datos.experiencia_descripcion,
        };
      }

      await usuarioService.update(sesion.id, payload);
      queryClient.invalidateQueries({ queryKey: ["usuario", sesion.id] });
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" {...register("nombre")} />
        {errors.nombre && <ErrorText>{errors.nombre.message}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="apellido">Apellido</Label>
        <Input id="apellido" {...register("apellido")} />
        {errors.apellido && <ErrorText>{errors.apellido.message}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="bio">Bio</Label>
        <TextArea id="bio" {...register("bio")} />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="ubicacion">Ubicación</Label>
        <Input id="ubicacion" {...register("ubicacion")} />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="fotoPerfil">URL foto de perfil</Label>
        <Input id="fotoPerfil" placeholder="https://..." {...register("fotoPerfil")} />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="github">GitHub</Label>
        <Input id="github" placeholder="https://github.com/tu-usuario" {...register("github")} />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input id="linkedin" placeholder="https://linkedin.com/in/tu-usuario" {...register("linkedin")} />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="portfolio">Web / portfolio externo</Label>
        <Input id="portfolio" placeholder="https://..." {...register("portfolio")} />
      </FormGroup>

      {sesion.role === "Freelancer" && (
        <>
          <FormGroup>
            <Label htmlFor="skills">Skills (formato nombre:nivel separados por ;)</Label>
            <Input id="skills" placeholder="React:5;Node.js:4" {...register("skills")} />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="experiencia_años">Años de experiencia</Label>
            <Input id="experiencia_años" type="number" min="0" {...register("experiencia_años")} />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="experiencia_descripcion">Descripción de experiencia</Label>
            <TextArea id="experiencia_descripcion" {...register("experiencia_descripcion")} />
          </FormGroup>
        </>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : "Guardar cambios"}
      </Button>
    </Form>
  );
};

export default EditarPerfil;
