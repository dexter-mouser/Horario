// Único módulo que habla con localStorage.
import { validarEvento } from './nucleo.js';

const CLAVE_EVENTOS = 'horario:eventos';
const CLAVE_FONDO = 'horario:fondo';

export function leerEventos() {
  try {
    const bruto = localStorage.getItem(CLAVE_EVENTOS);
    if (!bruto) return [];
    const datos = JSON.parse(bruto);
    if (!Array.isArray(datos)) return [];
    return datos.map(validarEvento).filter(Boolean); // descarta lo dañado
  } catch (error) {
    return [];
  }
}

export function guardarEventos(eventos) {
  try {
    localStorage.setItem(CLAVE_EVENTOS, JSON.stringify(eventos));
    return true;
  } catch (error) {
    return false;
  }
}

export function leerFondo() {
  try { return localStorage.getItem(CLAVE_FONDO); } catch (error) { return null; }
}

export function guardarFondo(identificador) {
  try { localStorage.setItem(CLAVE_FONDO, identificador); } catch (error) { /* se ignora */ }
}
