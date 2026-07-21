require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const mongoose = require("mongoose");

const Usuario = require("../models/Usuario");
const Servicio = require("../models/Servicio");
const Proyecto = require("../models/Proyecto");
const Transaccion = require("../models/Transaccion");
const Review = require("../models/Review");
const Portfolio = require("../models/Portfolio");
const Post = require("../models/Post");

const DATA_DIR = path.join(__dirname, "data");

// --- Helpers de parseo de CSV ---

const leerCSV = (nombreArchivo) => {
  const ruta = path.join(DATA_DIR, nombreArchivo);
  if (!fs.existsSync(ruta)) {
    console.warn(`⚠️  No se encontró ${nombreArchivo} en seeds/data/, se omite esa colección.`);
    return [];
  }
  const contenido = fs.readFileSync(ruta, "utf-8");
  return parse(contenido, { columns: true, skip_empty_lines: true, trim: true });
};

const listaDesde = (valor, separador = ";") =>
  valor
    ? valor
        .split(separador)
        .map((v) => v.trim())
        .filter(Boolean)
    : [];

const parsearSkills = (valor) =>
  listaDesde(valor).map((par) => {
    const [nombre, nivel] = par.split(":").map((v) => v.trim());
    return { nombre, nivel: Number(nivel) || 1 };
  });

const esVerdadero = (valor) => ["true", "1", "si", "sí"].includes(String(valor).toLowerCase());

const numeroOIndefinido = (valor) => (valor === undefined || valor === "" ? undefined : Number(valor));

// --- Seed principal ---

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Conectado a MongoDB para seeding");

  await Promise.all([
    Usuario.deleteMany({}),
    Servicio.deleteMany({}),
    Proyecto.deleteMany({}),
    Transaccion.deleteMany({}),
    Review.deleteMany({}),
    Portfolio.deleteMany({}),
    Post.deleteMany({}),
  ]);
  console.log("Colecciones limpiadas");

  const mapaUsuarios = new Map(); // email -> _id
  const mapaProyectos = new Map(); // "cliente_email||titulo" -> _id
  const mapaServicios = new Map(); // "freelancer_email||titulo" -> _id

  // 1. Usuarios
  const filasUsuarios = leerCSV("usuarios.csv");
  for (const fila of filasUsuarios) {
    const usuario = await Usuario.create({
      email: fila.email,
      password: fila.password,
      nombre: fila.nombre,
      apellido: fila.apellido,
      role: fila.role,
      fotoPerfil: fila.fotoPerfil || "",
      bio: fila.bio || "",
      ubicacion: fila.ubicacion || "",
      enlaces: {
        github: fila.github || "",
        linkedin: fila.linkedin || "",
        portfolio: fila.portfolio || "",
      },
      skills: parsearSkills(fila.skills),
      experiencia: {
        años: numeroOIndefinido(fila.experiencia_años) || 0,
        descripcion: fila.experiencia_descripcion || "",
      },
      verificado: esVerdadero(fila.verificado),
    });
    mapaUsuarios.set(fila.email, usuario._id);
  }
  console.log(`Usuarios insertados: ${filasUsuarios.length}`);

  // 2. Servicios
  const filasServicios = leerCSV("servicios.csv");
  for (const fila of filasServicios) {
    const freelancer_id = mapaUsuarios.get(fila.freelancer_email);
    if (!freelancer_id) {
      console.warn(`⚠️  Servicio "${fila.titulo}" omitido: freelancer_email "${fila.freelancer_email}" no existe`);
      continue;
    }
    const servicio = await Servicio.create({
      freelancer_id,
      titulo: fila.titulo,
      descripcion: fila.descripcion,
      categoria: fila.categoria,
      precioBase: Number(fila.precioBase),
      tiempoEntrega: Number(fila.tiempoEntrega),
      imagenPrincipal: fila.imagenPrincipal || "",
      tags: listaDesde(fila.tags),
    });
    mapaServicios.set(`${fila.freelancer_email}||${fila.titulo}`, servicio._id);
  }
  console.log(`Servicios insertados: ${filasServicios.length}`);

  // 3. Proyectos
  const filasProyectos = leerCSV("proyectos.csv");
  for (const fila of filasProyectos) {
    const cliente_id = mapaUsuarios.get(fila.cliente_email);
    if (!cliente_id) {
      console.warn(`⚠️  Proyecto "${fila.titulo}" omitido: cliente_email "${fila.cliente_email}" no existe`);
      continue;
    }
    const freelancer_asignado_id = fila.freelancer_asignado_email
      ? mapaUsuarios.get(fila.freelancer_asignado_email) || null
      : null;

    const proyecto = await Proyecto.create({
      cliente_id,
      titulo: fila.titulo,
      descripcion: fila.descripcion,
      presupuesto: Number(fila.presupuesto),
      deadline: new Date(fila.deadline),
      estado: fila.estado || "Abierto",
      tecnologiasRequeridas: listaDesde(fila.tecnologiasRequeridas),
      freelancer_asignado_id,
    });
    mapaProyectos.set(`${fila.cliente_email}||${fila.titulo}`, proyecto._id);
  }
  console.log(`Proyectos insertados: ${filasProyectos.length}`);

  // 4. Portfolio
  const filasPortfolio = leerCSV("portfolio.csv");
  for (const fila of filasPortfolio) {
    const freelancer_id = mapaUsuarios.get(fila.freelancer_email);
    if (!freelancer_id) {
      console.warn(`⚠️  Portfolio "${fila.titulo}" omitido: freelancer_email "${fila.freelancer_email}" no existe`);
      continue;
    }
    await Portfolio.create({
      freelancer_id,
      titulo: fila.titulo,
      descripcion: fila.descripcion,
      imagenes: listaDesde(fila.imagenes),
      enlaceProyecto: fila.enlaceProyecto || "",
      repositorioGithub: fila.repositorioGithub || "",
      tecnologias: listaDesde(fila.tecnologias),
      featured: esVerdadero(fila.featured),
    });
  }
  console.log(`Portfolio insertado: ${filasPortfolio.length}`);

  // 5. Posts
  const filasPosts = leerCSV("posts.csv");
  for (const fila of filasPosts) {
    const autor_id = mapaUsuarios.get(fila.autor_email);
    if (!autor_id) {
      console.warn(`⚠️  Post omitido: autor_email "${fila.autor_email}" no existe`);
      continue;
    }
    await Post.create({
      autor_id,
      contenido: fila.contenido,
      imagen: fila.imagen || "",
    });
  }
  console.log(`Posts insertados: ${filasPosts.length}`);

  // 6. Transacciones
  const filasTransacciones = leerCSV("transacciones.csv");
  for (const fila of filasTransacciones) {
    const cliente_id = mapaUsuarios.get(fila.cliente_email);
    const freelancer_id = mapaUsuarios.get(fila.freelancer_email);
    if (!cliente_id || !freelancer_id) {
      console.warn(`⚠️  Transacción omitida: cliente_email/freelancer_email no encontrados`);
      continue;
    }
    const proyecto_id = fila.proyecto_titulo
      ? mapaProyectos.get(`${fila.cliente_email}||${fila.proyecto_titulo}`) || null
      : null;
    const servicio_id = fila.servicio_titulo
      ? mapaServicios.get(`${fila.freelancer_email}||${fila.servicio_titulo}`) || null
      : null;

    await Transaccion.create({
      cliente_id,
      freelancer_id,
      proyecto_id,
      servicio_id,
      monto: Number(fila.monto),
      estado: fila.estado || "Pendiente",
      metodoPago: fila.metodoPago,
      fecha: fila.fecha ? new Date(fila.fecha) : new Date(),
    });
  }
  console.log(`Transacciones insertadas: ${filasTransacciones.length}`);

  // 7. Reviews
  const filasReviews = leerCSV("reviews.csv");
  for (const fila of filasReviews) {
    const autor_id = mapaUsuarios.get(fila.autor_email);
    const freelancer_id = mapaUsuarios.get(fila.freelancer_email);
    const proyecto_id = mapaProyectos.get(`${fila.autor_email}||${fila.proyecto_titulo}`);
    if (!autor_id || !freelancer_id || !proyecto_id) {
      console.warn(`⚠️  Review omitida: no se pudo resolver autor/freelancer/proyecto`);
      continue;
    }

    await Review.create({
      autor_id,
      freelancer_id,
      proyecto_id,
      puntuacion: Number(fila.puntuacion),
      comentario: fila.comentario,
      aspectos: {
        comunicacion: Number(fila.aspecto_comunicacion),
        calidad: Number(fila.aspecto_calidad),
        puntualidad: Number(fila.aspecto_puntualidad),
      },
    });
  }
  console.log(`Reviews insertadas: ${filasReviews.length}`);

  // Recalcular rating promedio de cada freelancer con reviews
  const freelancersConReviews = await Review.distinct("freelancer_id");
  for (const freelancer_id of freelancersConReviews) {
    const reviews = await Review.find({ freelancer_id });
    const cantidad = reviews.length;
    const promedio = reviews.reduce((s, r) => s + r.puntuacion, 0) / cantidad;
    await Usuario.findByIdAndUpdate(freelancer_id, {
      rating: { promedio: Math.round(promedio * 10) / 10, cantidad },
    });
  }

  console.log("✅ Seed completado correctamente");
  await mongoose.disconnect();
};

seed().catch((error) => {
  console.error("Error durante el seed:", error);
  process.exit(1);
});
