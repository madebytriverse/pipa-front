// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api", 
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("Error API:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;
