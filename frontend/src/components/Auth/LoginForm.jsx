import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { loginSchema } from "../../schemas";
import { Form, FormGroup, Label, Input, ErrorText, Button } from "../../styles/ui";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (datos) => {
    try {
      await login(datos);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
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

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
    </Form>
  );
};

export default LoginForm;
