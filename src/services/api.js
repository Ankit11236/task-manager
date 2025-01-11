import axios from "axios";

// const BASE_URL = "http://localhost:5100/api";
const BASE_URL = "https://e01a-2409-40d4-fd-42bf-c9ff-e93e-bd74-db8f.ngrok-free.app/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["ngrok-skip-browser-warning"] =  "true"
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const api = {
  get: (route, params) => {
    return axiosInstance.get(route, { params });
  },

  post: (route, data) => {
    return axiosInstance.post(route, data);
  },

  put: (route, data) => {
    return axiosInstance.put(route, data);
  },

  delete: (route, params) => {
    return axiosInstance.delete(route, { params });
  },

  patch: (route, data) => {
    return axiosInstance.patch(route, data);
  },
};

export default api;
