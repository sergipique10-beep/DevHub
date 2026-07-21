import api from "./api";

const register = (datos) => api.post("/auth/register", datos).then((res) => res.data);
const login = (datos) => api.post("/auth/login", datos).then((res) => res.data);
const logout = () => api.post("/auth/logout").then((res) => res.data);
const verify = () => api.get("/auth/verify").then((res) => res.data);

export default { register, login, logout, verify };
