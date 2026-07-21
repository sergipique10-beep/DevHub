import api from "./api";

const getAll = () => api.get("/usuarios").then((res) => res.data);

const buscar = (filtros = {}) => {
  const params = new URLSearchParams();
  if (filtros.skills?.length) params.set("skills", filtros.skills.join(","));
  if (filtros.minRating) params.set("minRating", filtros.minRating);
  return api.get(`/usuarios/buscar?${params.toString()}`).then((res) => res.data);
};

const getById = (id) => api.get(`/usuarios/${id}`).then((res) => res.data);
const update = (id, datos) => api.put(`/usuarios/${id}`, datos).then((res) => res.data);
const remove = (id) => api.delete(`/usuarios/${id}`).then((res) => res.data);

export default { getAll, buscar, getById, update, remove };
