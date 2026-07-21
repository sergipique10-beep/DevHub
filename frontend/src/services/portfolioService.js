import api from "./api";

const getPorFreelancer = (freelancerId) =>
  api.get(`/portfolio/${freelancerId}`).then((res) => res.data);
const create = (datos) => api.post("/portfolio", datos).then((res) => res.data);
const update = (id, datos) => api.put(`/portfolio/${id}`, datos).then((res) => res.data);
const remove = (id) => api.delete(`/portfolio/${id}`).then((res) => res.data);

export default { getPorFreelancer, create, update, remove };
