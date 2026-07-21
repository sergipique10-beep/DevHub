import api from "./api";

const getAll = () => api.get("/transacciones").then((res) => res.data);
const getPorUsuario = (usuarioId) =>
  api.get(`/transacciones/${usuarioId}`).then((res) => res.data);
const create = (datos) => api.post("/transacciones", datos).then((res) => res.data);

export default { getAll, getPorUsuario, create };
