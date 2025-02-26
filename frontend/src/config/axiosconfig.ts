import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.REACT_PUBLIC_API_BACKEND || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar localStorage y estado global si es necesario
      localStorage.removeItem("current-token");
    }
    return Promise.reject(error);
  }
);
