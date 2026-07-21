const express = require("express");
const router = express.Router();
const {
  getProyectos,
  getProyectoPorId,
  crearProyecto,
  cambiarEstado,
  enviarPropuesta,
  asignarFreelancer,
} = require("../controllers/proyectoController");
const protegerRuta = require("../middleware/authMiddleware");
const permitirRoles = require("../middleware/roleMiddleware");
const { proyectoValidator, propuestaValidator } = require("../utils/validators");

router.get("/", getProyectos);
router.get("/:id", getProyectoPorId);
router.post("/", protegerRuta, permitirRoles("Cliente"), proyectoValidator, crearProyecto);
router.put("/:id/estado", protegerRuta, permitirRoles("Cliente"), cambiarEstado);
router.post(
  "/:id/propuestas",
  protegerRuta,
  permitirRoles("Freelancer"),
  propuestaValidator,
  enviarPropuesta
);
router.put("/:id/asignar", protegerRuta, permitirRoles("Cliente"), asignarFreelancer);

module.exports = router;
