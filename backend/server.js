require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const servicioRoutes = require("./routes/servicioRoutes");
const proyectoRoutes = require("./routes/proyectoRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const postRoutes = require("./routes/postRoutes");
const transaccionRoutes = require("./routes/transaccionRoutes");

const app = express();

connectDB();

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ mensaje: "DevHub API funcionando correctamente" });
});

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/servicios", servicioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/transacciones", transaccionRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor DevHub corriendo en el puerto ${PORT}`);
});
