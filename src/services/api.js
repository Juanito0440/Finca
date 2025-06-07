import axios from "axios";
const API = "http://localhost:3001";

export const getRecolectores = () => axios.get(`${API}/recolectores`);
export const createRecolector = (data) => axios.post(`${API}/recolectores`, data);
export const createRecoleccion = (data) => axios.post(`${API}/recolecciones`, data);
export const getRecolecciones = (id) => axios.get(`${API}/recolecciones/${id}`);
export const updateRecoleccion = (id, data) => axios.put(`${API}/recolecciones/${id}`, data);
