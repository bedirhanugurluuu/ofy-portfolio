import axios, { InternalAxiosRequestConfig } from "axios";

let csrfToken: string | null = null;

export function setCsrfToken(token: string) {
  csrfToken = token;
}

const instance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.headers) {
    config.headers = new axios.AxiosHeaders();
  }

  const token = localStorage.getItem("token");
  if (token) {
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  if (csrfToken) {
    (config.headers as Record<string, string>)["X-CSRF-Token"] = csrfToken;
  }

  return config;
});

export default instance;
