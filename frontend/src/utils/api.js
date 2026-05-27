import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000"
});

// 🔹 Request Interceptor (attach token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔹 Response Interceptor (handle errors globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // unauthorized → logout
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (status === 500) {
      console.error("Server error");
    }

    return Promise.reject(error);
  }
);

export default api;