// Tema: modo (sistema / claro / oscuro) y color de acento.
// Solo actúa con el fondo "Estándar"; las escenas (Aurora, etc.) traen su propia paleta.
import { calcularAcento, normalizarHex } from './color.js';
import { guardarAcento, guardarModo, leerAcento, leerModo } from './almacenamiento.js';
import { actualizarColorBarra } from './fondos.js';

export const MODOS = ['sistema', 'claro', 'oscuro'];

// Un tono neutro y cuatro brillantes, claramente distintos entre sí
export const ACENTOS = [
  { id: 'grafito', nombre: 'Grafito', color: '#7d8798' },
  { id: 'azul', nombre: 'Azul', color: '#3d8bff' },
  { id: 'lima', nombre: 'Lima', color: '#8fe04a' },
  { id: 'naranja', nombre: 'Naranja', color: '#ff7a2f' },
  { id: 'magenta', nombre: 'Magenta', color: '#ff3d9a' },
];
export const ACENTO_POR_DEFECTO = '#3d8bff';

// Variable CSS que corresponde a cada valor de calcularAcento()
const VARIABLES = {
  acento: '--acento',
  sobre: '--texto-sobre-acento',
  textoOscuro: '--acento-texto-oscuro',
  textoClaro: '--acento-texto-claro',
};

const raiz = document.documentElement;
const consultaOscuro = window.matchMedia('(prefers-color-scheme: dark)');

export function crearTema({ alCambiar }) {
  let modo = leerModo();
  if (!MODOS.includes(modo)) modo = 'sistema';
  let acento = normalizarHex(leerAcento()) || ACENTO_POR_DEFECTO;
  let activo = false; // true cuando el fondo es "Estándar"

  const avisar = () => { if (alCambiar) alCambiar(); };
  const modoResuelto = () => (modo === 'sistema' ? (consultaOscuro.matches ? 'oscuro' : 'claro') : modo);

  function pintarModo() {
    if (activo && modo !== 'sistema') raiz.dataset.tema = modo;
    else delete raiz.dataset.tema; // sin atributo manda la preferencia del sistema
    actualizarColorBarra();
  }

  function pintarAcento() {
    if (!activo) {
      Object.values(VARIABLES).forEach((variable) => raiz.style.removeProperty(variable));
      return;
    }
    const valores = calcularAcento(acento);
    Object.entries(VARIABLES).forEach(([clave, variable]) => raiz.style.setProperty(variable, valores[clave]));
  }

  // Se llama al cambiar de fondo: el tema solo está activo con "Estándar"
  function aplicarFondo(esEstandar) {
    activo = esEstandar;
    pintarModo();
    pintarAcento();
    avisar();
  }

  function elegirModo(nuevoModo) {
    if (!MODOS.includes(nuevoModo)) return;
    modo = nuevoModo;
    guardarModo(modo);
    pintarModo();
    avisar();
  }

  // persistir = false mientras se arrastra el selector libre; true al soltar
  function elegirAcento(color, persistir = true) {
    const limpio = normalizarHex(color);
    if (!limpio) return;
    acento = limpio;
    pintarAcento();
    if (persistir) guardarAcento(acento, calcularAcento(acento));
    avisar();
  }

  // Si el sistema cambia de claro a oscuro y se sigue al sistema, se actualiza todo
  consultaOscuro.addEventListener('change', () => {
    if (activo && modo === 'sistema') {
      actualizarColorBarra();
      avisar();
    }
  });

  return {
    aplicarFondo,
    elegirModo,
    elegirAcento,
    estado: () => ({ activo, modo, acento, modoResuelto: modoResuelto() }),
  };
}
