import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // adapte le port à ton backend
});

export default api;
