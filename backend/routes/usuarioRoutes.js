const express = require("express");
const router = express.Router();
const {
  getUsuarios,
  buscarUsuarios,
  getUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
} = require("../controllers/usuarioController");
const protegerRuta = require("../middleware/authMiddleware");
const permitirRoles = require("../middleware/roleMiddleware");

router.get("/", getUsuarios);
router.get("/buscar", buscarUsuarios);
router.get("/:id", getUsuarioPorId);
router.put("/:id", protegerRuta, actualizarUsuario);
router.delete("/:id", protegerRuta, permitirRoles("Admin"), eliminarUsuario);

module.exports = router;
