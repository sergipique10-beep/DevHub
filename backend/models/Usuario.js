const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["Admin", "Freelancer", "Cliente"],
      required: true,
    },
    fotoPerfil: { type: String, default: "" },
    bio: { type: String, default: "" },
    ubicacion: { type: String, default: "" },
    enlaces: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },
    skills: [
      {
        nombre: { type: String, required: true },
        nivel: { type: Number, min: 1, max: 5, required: true },
      },
    ],
    experiencia: {
      años: { type: Number, default: 0 },
      descripcion: { type: String, default: "" },
    },
    rating: {
      promedio: { type: Number, min: 0, max: 5, default: 0 },
      cantidad: { type: Number, default: 0 },
    },
    verificado: { type: Boolean, default: false },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

usuarioSchema.methods.compararPassword = async function (passwordCandidato) {
  return bcrypt.compare(passwordCandidato, this.password);
};

module.exports = mongoose.model("Usuario", usuarioSchema);
