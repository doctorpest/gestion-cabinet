import axios from 'axios';

const api = axios.create({
  baseURL: 'http://backend:3000/api', // adapte le port à ton backend
});

// Ajout automatique du token si présent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api;
