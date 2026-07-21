const { body, validationResult } = require("express-validator");

const validar = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ error: errores.array()[0].msg, detalles: errores.array() });
  }
  next();
};

const registroValidator = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("apellido").notEmpty().withMessage("El apellido es obligatorio"),
  body("role").isIn(["Admin", "Freelancer", "Cliente"]).withMessage("Rol inválido"),
  validar,
];

const loginValidator = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  validar,
];

const servicioValidator = [
  body("titulo").notEmpty().withMessage("El título es obligatorio"),
  body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),
  body("categoria").notEmpty().withMessage("La categoría es obligatoria"),
  body("precioBase").isFloat({ min: 0 }).withMessage("El precio base debe ser un número positivo"),
  body("tiempoEntrega").isInt({ min: 1 }).withMessage("El tiempo de entrega debe ser al menos 1 día"),
  validar,
];

const proyectoValidator = [
  body("titulo").notEmpty().withMessage("El título es obligatorio"),
  body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),
  body("presupuesto").isFloat({ min: 0 }).withMessage("El presupuesto debe ser un número positivo"),
  body("deadline").isISO8601().withMessage("La fecha límite debe ser una fecha válida"),
  validar,
];

const propuestaValidator = [
  body("precio").isFloat({ min: 0 }).withMessage("El precio debe ser un número positivo"),
  body("mensaje").notEmpty().withMessage("El mensaje es obligatorio"),
  validar,
];

const reviewValidator = [
  body("proyecto_id").notEmpty().withMessage("El proyecto es obligatorio"),
  body("puntuacion").isInt({ min: 1, max: 5 }).withMessage("La puntuación debe estar entre 1 y 5"),
  body("comentario").notEmpty().withMessage("El comentario es obligatorio"),
  body("aspectos.comunicacion").isInt({ min: 1, max: 5 }).withMessage("La comunicación debe estar entre 1 y 5"),
  body("aspectos.calidad").isInt({ min: 1, max: 5 }).withMessage("La calidad debe estar entre 1 y 5"),
  body("aspectos.puntualidad").isInt({ min: 1, max: 5 }).withMessage("La puntualidad debe estar entre 1 y 5"),
  validar,
];

const portfolioValidator = [
  body("titulo").notEmpty().withMessage("El título es obligatorio"),
  body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),
  validar,
];

const postValidator = [
  body("contenido").notEmpty().withMessage("El contenido es obligatorio"),
  validar,
];

const transaccionValidator = [
  body("cliente_id").notEmpty().withMessage("El cliente es obligatorio"),
  body("freelancer_id").notEmpty().withMessage("El freelancer es obligatorio"),
  body("monto").isFloat({ min: 0 }).withMessage("El monto debe ser un número positivo"),
  body("metodoPago").notEmpty().withMessage("El método de pago es obligatorio"),
  validar,
];

module.exports = {
  validar,
  registroValidator,
  loginValidator,
  servicioValidator,
  proyectoValidator,
  propuestaValidator,
  reviewValidator,
  portfolioValidator,
  postValidator,
  transaccionValidator,
};
