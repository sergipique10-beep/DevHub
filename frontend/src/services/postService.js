import api from "./api";

const getAll = () => api.get("/posts").then((res) => res.data);
const create = (datos) => api.post("/posts", datos).then((res) => res.data);
const update = (id, datos) => api.put(`/posts/${id}`, datos).then((res) => res.data);
const remove = (id) => api.delete(`/posts/${id}`).then((res) => res.data);
const toggleLike = (id) => api.post(`/posts/${id}/like`).then((res) => res.data);
const agregarComentario = (id, contenido) =>
  api.post(`/posts/${id}/comentarios`, { contenido }).then((res) => res.data);

export default { getAll, create, update, remove, toggleLike, agregarComentario };
