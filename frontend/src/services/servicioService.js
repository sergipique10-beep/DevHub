import api from "./api";

const getAll = (filtros = {}) => {
  const params = new URLSearchParams();
  if (filtros.categoria) params.set("categoria", filtros.categoria);
  if (filtros.freelancer_id) params.set("freelancer_id", filtros.freelancer_id);
  return api.get(`/servicios?${params.toString()}`).then((res) => res.data);
};

const getById = (id) => api.get(`/servicios/${id}`).then((res) => res.data);
const create = (datos) => api.post("/servicios", datos).then((res) => res.data);
const update = (id, datos) => api.put(`/servicios/${id}`, datos).then((res) => res.data);
const remove = (id) => api.delete(`/servicios/${id}`).then((res) => res.data);

export default { getAll, getById, create, update, remove };
