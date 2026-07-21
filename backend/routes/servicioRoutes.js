const express = require("express");
const router = express.Router();
const {
  getServicios,
  getServicioPorId,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
} = require("../controllers/servicioController");
const protegerRuta = require("../middleware/authMiddleware");
const permitirRoles = require("../middleware/roleMiddleware");
const { servicioValidator } = require("../utils/validators");

router.get("/", getServicios);
router.get("/:id", getServicioPorId);
router.post("/", protegerRuta, permitirRoles("Freelancer"), servicioValidator, crearServicio);
router.put("/:id", protegerRuta, permitirRoles("Freelancer"), actualizarServicio);
router.delete("/:id", protegerRuta, permitirRoles("Freelancer", "Admin"), eliminarServicio);

module.exports = router;
