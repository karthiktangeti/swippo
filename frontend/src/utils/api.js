import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api`
    : "/api",
});

console.log("API baseURL:", api.defaults.baseURL); // Debug: check backend URL
api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("sw_token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("sw_token");
      localStorage.removeItem("sw_user");
      window.location.href = "/";
    }
    return Promise.reject(err);
  },
);
console.log("API baseURL:", api.defaults.baseURL);
export default api;
