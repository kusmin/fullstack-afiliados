import axios from 'axios';
import AuthService from "../service/AuthService";

const api = axios.create({
  baseURL: import.meta.env.VITE_HOST_API, 
  timeout: 2000, 
  headers: {
    'Content-Type': 'application/json',
    // Adicione outros headers globais aqui, se necessário
  },
});

api.interceptors.request.use((config) => {
    let token = AuthService.token();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

api.interceptors.response.use( (response)  => {
    return response
}, (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      AuthService.logout();
      window.location = "/login";
    }
    return Promise.reject(error)
})

export default api;