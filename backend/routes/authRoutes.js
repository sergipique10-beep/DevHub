const express = require("express");
const router = express.Router();
const { register, login, logout, verify } = require("../controllers/authController");
const protegerRuta = require("../middleware/authMiddleware");
const { registroValidator, loginValidator } = require("../utils/validators");

router.post("/register", registroValidator, register);
router.post("/login", loginValidator, login);
router.post("/logout", protegerRuta, logout);
router.get("/verify", protegerRuta, verify);

module.exports = router;
