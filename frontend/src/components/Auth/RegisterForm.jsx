import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { registroSchema } from "../../schemas";
import { Form, FormGroup, Label, Input, Select, ErrorText, Button } from "../../styles/ui";

const RegisterForm = () => {
  const { register: registrarse } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registroSchema) });

  const onSubmit = async (datos) => {
    try {
      await registrarse(datos);
      navigate("/dashboard");
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
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="role">Quiero registrarme como</Label>
        <Select id="role" defaultValue="" {...register("role")}>
          <option value="" disabled>
            Elige un rol
          </option>
          <option value="Freelancer">Freelancer (ofrezco servicios)</option>
          <option value="Cliente">Cliente (busco talento)</option>
        </Select>
        {errors.role && <ErrorText>{errors.role.message}</ErrorText>}
      </FormGroup>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
      </Button>
    </Form>
  );
};

export default RegisterForm;
