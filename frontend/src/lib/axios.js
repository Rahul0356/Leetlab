import axios from "axios";

const apiBase =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development" ? "http://localhost:8080/api/v1" : "/api/v1");

export const axiosInstance = axios.create({
  baseURL: apiBase,
  withCredentials: true,
});