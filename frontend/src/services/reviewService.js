import api from "./api";

const getPorFreelancer = (freelancerId) =>
  api.get(`/reviews/${freelancerId}`).then((res) => res.data);
const create = (datos) => api.post("/reviews", datos).then((res) => res.data);

export default { getPorFreelancer, create };
