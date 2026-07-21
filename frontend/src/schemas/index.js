import { z } from "zod";

export const registroSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  role: z.enum(["Freelancer", "Cliente"], { errorMap: () => ({ message: "Elige un rol" }) }),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const servicioSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  categoria: z.string().min(1, "La categoría es obligatoria"),
  precioBase: z.coerce.number().min(0, "El precio debe ser positivo"),
  tiempoEntrega: z.coerce.number().int().min(1, "Debe ser al menos 1 día"),
  imagenPrincipal: z.string().optional().or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
});

export const proyectoSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  presupuesto: z.coerce.number().min(0, "El presupuesto debe ser positivo"),
  deadline: z.string().min(1, "La fecha límite es obligatoria"),
  tecnologiasRequeridas: z.string().optional().or(z.literal("")),
});

export const propuestaSchema = z.object({
  precio: z.coerce.number().min(0, "El precio debe ser positivo"),
  mensaje: z.string().min(1, "El mensaje es obligatorio"),
});

export const reviewSchema = z.object({
  puntuacion: z.coerce.number().int().min(1).max(5),
  comentario: z.string().min(1, "El comentario es obligatorio"),
  comunicacion: z.coerce.number().int().min(1).max(5),
  calidad: z.coerce.number().int().min(1).max(5),
  puntualidad: z.coerce.number().int().min(1).max(5),
});

export const perfilSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  bio: z.string().optional().or(z.literal("")),
  ubicacion: z.string().optional().or(z.literal("")),
  fotoPerfil: z.string().optional().or(z.literal("")),
  github: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  portfolio: z.string().optional().or(z.literal("")),
  skills: z.string().optional().or(z.literal("")),
  experiencia_años: z.coerce.number().optional(),
  experiencia_descripcion: z.string().optional().or(z.literal("")),
});

export const postSchema = z.object({
  contenido: z.string().min(1, "El contenido es obligatorio"),
  imagen: z.string().optional().or(z.literal("")),
});

export const portfolioSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  imagenes: z.string().optional().or(z.literal("")),
  enlaceProyecto: z.string().optional().or(z.literal("")),
  repositorioGithub: z.string().optional().or(z.literal("")),
  tecnologias: z.string().optional().or(z.literal("")),
});
