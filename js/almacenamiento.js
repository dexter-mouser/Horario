// Único módulo que habla con localStorage.
import { validarEvento } from './nucleo.js';
import { MAX_TURNOS, validarTurno } from './turnos.js';

const CLAVE_EVENTOS = 'horario:eventos';
const CLAVE_TURNOS = 'horario:turnos';
const CLAVE_FONDO = 'horario:fondo';

// Lee una lista JSON y descarta los elementos dañados
function leerLista(clave, validar) {
  try {
    const bruto = localStorage.getItem(clave);
    if (!bruto) return [];
    const datos = JSON.parse(bruto);
    if (!Array.isArray(datos)) return [];
    return datos.map(validar).filter(Boolean);
  } catch (error) {
    return [];
  }
}

function guardarLista(clave, lista) {
  try {
    localStorage.setItem(clave, JSON.stringify(lista));
    return true;
  } catch (error) {
    return false;
  }
}

export const leerEventos = () => leerLista(CLAVE_EVENTOS, validarEvento);
export const guardarEventos = (eventos) => guardarLista(CLAVE_EVENTOS, eventos);
export const leerTurnos = () => leerLista(CLAVE_TURNOS, validarTurno).slice(0, MAX_TURNOS);
export const guardarTurnos = (turnos) => guardarLista(CLAVE_TURNOS, turnos);

export function leerFondo() {
  try { return localStorage.getItem(CLAVE_FONDO); } catch (error) { return null; }
}

export function guardarFondo(identificador) {
  try { localStorage.setItem(CLAVE_FONDO, identificador); } catch (error) { /* se ignora */ }
}
