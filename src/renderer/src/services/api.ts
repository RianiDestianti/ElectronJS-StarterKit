import axios from 'axios';
import { getToken } from '@/libs/storage';

// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.RENDERER_VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token for request interceptor:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Backend mengembalikan { status, message, data } juga untuk 401/403/404,
// jadi response error tetap diteruskan ke slice seperti response biasa.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.status) {
      return Promise.resolve(error.response);
    }
    return Promise.reject(error);
  }
);

export default api;
