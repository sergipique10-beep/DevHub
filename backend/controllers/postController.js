const Post = require("../models/Post");

// GET /api/posts (feed)
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("autor_id", "nombre apellido fotoPerfil role")
      .populate("comentarios.usuario_id", "nombre apellido fotoPerfil")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// POST /api/posts (cualquier usuario)
const crearPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      ...req.body,
      autor_id: req.usuario._id,
    });
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// PUT /api/posts/:id (solo autor)
const actualizarPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post no encontrado" });
    }
    if (post.autor_id.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ error: "Solo puedes editar tus propios posts" });
    }

    if (req.body.contenido !== undefined) post.contenido = req.body.contenido;
    if (req.body.imagen !== undefined) post.imagen = req.body.imagen;
    await post.save();
    res.json(post);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/posts/:id (solo autor o Admin)
const eliminarPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post no encontrado" });
    }
    if (post.autor_id.toString() !== req.usuario._id.toString() && req.usuario.role !== "Admin") {
      return res.status(403).json({ error: "Solo puedes eliminar tus propios posts" });
    }

    await post.deleteOne();
    res.json({ mensaje: "Post eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

// POST /api/posts/:id/like
const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post no encontrado" });
    }

    const yaLeDioLike = post.likes.some((id) => id.toString() === req.usuario._id.toString());
    if (yaLeDioLike) {
      post.likes = post.likes.filter((id) => id.toString() !== req.usuario._id.toString());
    } else {
      post.likes.push(req.usuario._id);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    next(error);
  }
};

// POST /api/posts/:id/comentarios
const agregarComentario = async (req, res, next) => {
  try {
    const { contenido } = req.body;
    if (!contenido) {
      return res.status(400).json({ error: "El contenido del comentario es obligatorio" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post no encontrado" });
    }

    post.comentarios.push({ usuario_id: req.usuario._id, contenido });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  crearPost,
  actualizarPost,
  eliminarPost,
  toggleLike,
  agregarComentario,
};
