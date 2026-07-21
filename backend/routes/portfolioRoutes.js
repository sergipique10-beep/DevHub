const express = require("express");
const router = express.Router();
const {
  getPortfolioPorFreelancer,
  crearPortfolio,
  actualizarPortfolio,
  eliminarPortfolio,
} = require("../controllers/portfolioController");
const protegerRuta = require("../middleware/authMiddleware");
const permitirRoles = require("../middleware/roleMiddleware");
const { portfolioValidator } = require("../utils/validators");

router.get("/:freelancer_id", getPortfolioPorFreelancer);
router.post("/", protegerRuta, permitirRoles("Freelancer"), portfolioValidator, crearPortfolio);
router.put("/:id", protegerRuta, permitirRoles("Freelancer"), actualizarPortfolio);
router.delete("/:id", protegerRuta, permitirRoles("Freelancer", "Admin"), eliminarPortfolio);

module.exports = router;
