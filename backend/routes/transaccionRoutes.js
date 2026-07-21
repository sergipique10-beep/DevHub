const express = require("express");
const router = express.Router();
const {
  getTransacciones,
  getTransaccionesPorUsuario,
  crearTransaccion,
} = require("../controllers/transaccionController");
const protegerRuta = require("../middleware/authMiddleware");
const permitirRoles = require("../middleware/roleMiddleware");
const { transaccionValidator } = require("../utils/validators");

router.get("/", protegerRuta, permitirRoles("Admin"), getTransacciones);
router.get("/:usuario_id", protegerRuta, getTransaccionesPorUsuario);
router.post("/", protegerRuta, transaccionValidator, crearTransaccion);

module.exports = router;
