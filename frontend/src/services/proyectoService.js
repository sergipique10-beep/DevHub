import api from "./api";

const getAll = (filtros = {}) => {
  const params = new URLSearchParams();
  if (filtros.estado) params.set("estado", filtros.estado);
  if (filtros.cliente_id) params.set("cliente_id", filtros.cliente_id);
  return api.get(`/proyectos?${params.toString()}`).then((res) => res.data);
};

const getById = (id) => api.get(`/proyectos/${id}`).then((res) => res.data);
const create = (datos) => api.post("/proyectos", datos).then((res) => res.data);
const cambiarEstado = (id, estado) =>
  api.put(`/proyectos/${id}/estado`, { estado }).then((res) => res.data);
const enviarPropuesta = (id, datos) =>
  api.post(`/proyectos/${id}/propuestas`, datos).then((res) => res.data);
const asignarFreelancer = (id, freelancer_id) =>
  api.put(`/proyectos/${id}/asignar`, { freelancer_id }).then((res) => res.data);

export default { getAll, getById, create, cambiarEstado, enviarPropuesta, asignarFreelancer };
