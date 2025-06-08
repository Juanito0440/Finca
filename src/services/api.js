// import axios from "axios";
// const API = "http://localhost:3001";

// export const getRecolectores = () => axios.get(`${API}/recolectores`);
// export const createRecolector = (data) => axios.post(`${API}/recolectores`, data);
// export const createRecoleccion = (data) => axios.post(`${API}/recolecciones`, data);
// export const getRecolecciones = (id) => axios.get(`${API}/recolecciones/${id}`);
// export const updateRecoleccion = (id, data) => axios.put(`${API}/recolecciones/${id}`, data);

//nuevo codigo

import axios from 'axios';

// Base URL de la API desde variable de entorno
const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '');

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en API:', error);
    
    if (error.code === 'ERR_NETWORK') {
      console.error('Error de red - verificar conexión o estado del servidor');
    }
    
    return Promise.reject(error);
  }
);

// Funciones para recolectores
export const getRecolectores = () => {
  return api.get('/recolectores');
};

export const createRecolector = (recolectorData) => {
  return api.post('/recolectores', recolectorData);
};

export const updateRecolector = (id, recolectorData) => {
  return api.put(`/recolectores/${id}`, recolectorData);
};

export const deleteRecolector = (id) => {
  return api.delete(`/recolectores/${id}`);
};

// Funciones para recolecciones
export const getRecolecciones = (recolectorId) => {
  return api.get(`/recolecciones/${recolectorId}`);
};

export const createRecoleccion = (recoleccionData) => {
  return api.post('/recolecciones', recoleccionData);
};

export const updateRecoleccion = (id, recoleccionData) => {
  return api.put(`/recolecciones/${id}`, recoleccionData);
};

export const deleteRecoleccion = (id) => {
  return api.delete(`/recolecciones/${id}`);
};

// Funciones para totales y cálculos
export const getRecolectoresTotales = () => {
  return api.get('/recolectores/totales');
};

export const getRecolectorTotal = (recolectorId) => {
  return api.get(`/recolectores/${recolectorId}/total`);
};

export const getResumenGeneral = () => {
  return api.get('/resumen/general');
};

export default api;