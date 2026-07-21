const mongoose = require("mongoose");

const comentarioSchema = new mongoose.Schema(
  {
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    contenido: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const postSchema = new mongoose.Schema(
  {
    autor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    contenido: { type: String, required: true },
    imagen: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }],
    comentarios: [comentarioSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
