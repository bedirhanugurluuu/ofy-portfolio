// utils/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",  // API base URL
  withCredentials: true,             // cookie ve credentials gerekiyorsa
  headers: {
    "Content-Type": "application/json",
    // Diğer default headerlar
  },
});

// İstersen interceptor da ekleyebilirsin, örn. auth token eklemek için

export default axiosInstance;
