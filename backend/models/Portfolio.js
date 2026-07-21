const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    freelancer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true },
    imagenes: [{ type: String }],
    enlaceProyecto: { type: String, default: "" },
    repositorioGithub: { type: String, default: "" },
    tecnologias: [{ type: String }],
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
