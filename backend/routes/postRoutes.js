const express = require("express");
const router = express.Router();
const {
  getPosts,
  crearPost,
  actualizarPost,
  eliminarPost,
  toggleLike,
  agregarComentario,
} = require("../controllers/postController");
const protegerRuta = require("../middleware/authMiddleware");
const { postValidator } = require("../utils/validators");

router.get("/", getPosts);
router.post("/", protegerRuta, postValidator, crearPost);
router.put("/:id", protegerRuta, actualizarPost);
router.delete("/:id", protegerRuta, eliminarPost);
router.post("/:id/like", protegerRuta, toggleLike);
router.post("/:id/comentarios", protegerRuta, agregarComentario);

module.exports = router;
