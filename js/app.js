// Arranque y coordinación de pantallas.
import { aplicarFondo, FONDO_POR_DEFECTO } from './fondos.js';
import { guardarEventos, guardarFondo, leerEventos, leerFondo } from './almacenamiento.js';
import { guardarEnLista, quitarDeLista } from './nucleo.js';
import { diaActual } from './tiempo.js';
import { pintarIconos } from './iconos.js';
import { crearHoja } from './hoja.js';
import { crearVistaHoy } from './vista-hoy.js';
import { crearVistaSemana } from './vista-semana.js';
import { crearVistaAjustes } from './vista-ajustes.js';

// --- Estado de la aplicación ---
const estado = {
  eventos: leerEventos(),
  diaVisto: diaActual(),
  pantalla: 'hoy',
  fondo: aplicarFondo(leerFondo() || FONDO_POR_DEFECTO),
};

const secciones = {
  hoy: document.getElementById('pantalla-hoy'),
  semana: document.getElementById('pantalla-semana'),
  ajustes: document.getElementById('pantalla-ajustes'),
};
const botonesBarra = document.querySelectorAll('.boton-barra');

// --- Acciones ---
function editarEvento(id) {
  const evento = estado.eventos.find((actual) => actual.id === id);
  if (evento) hoja.abrir({ evento, dia: evento.dia });
}

function elegirDia(dia) {
  estado.diaVisto = dia;
  pintarActual();
}

function irADia(dia) {
  estado.diaVisto = dia;
  cambiarPantalla('hoy');
}

function guardarEvento(evento) {
  estado.eventos = guardarEnLista(estado.eventos, evento);
  guardarEventos(estado.eventos);
  if (estado.pantalla === 'hoy') estado.diaVisto = evento.dia; // se muestra el día donde quedó
  pintarActual();
}

function borrarEvento(id) {
  estado.eventos = quitarDeLista(estado.eventos, id);
  guardarEventos(estado.eventos);
  pintarActual();
}

function elegirFondo(identificador) {
  estado.fondo = aplicarFondo(identificador);
  guardarFondo(estado.fondo);
  vistaAjustes.pintar(estado.fondo);
}

// --- Componentes ---
const hoja = crearHoja({ alGuardar: guardarEvento, alBorrar: borrarEvento });
const vistaHoy = crearVistaHoy({ alEditar: editarEvento, alElegirDia: elegirDia });
const vistaSemana = crearVistaSemana({ alEditar: editarEvento, alIrADia: irADia });
const vistaAjustes = crearVistaAjustes({ alElegirFondo: elegirFondo });

// --- Pintado: solo se dibuja la pantalla visible ---
function pintarActual() {
  if (estado.pantalla === 'hoy') vistaHoy.pintar(estado.eventos, estado.diaVisto);
  else if (estado.pantalla === 'semana') vistaSemana.pintar(estado.eventos);
  else vistaAjustes.pintar(estado.fondo);
}

function cambiarPantalla(nombre) {
  estado.pantalla = nombre;
  Object.entries(secciones).forEach(([clave, seccion]) => { seccion.hidden = clave !== nombre; });
  botonesBarra.forEach((boton) => {
    if (boton.dataset.pantalla === nombre) boton.setAttribute('aria-current', 'page');
    else boton.removeAttribute('aria-current');
  });
  pintarActual();
  programarReloj();
}

// --- Reloj: actualiza la etiqueta "Ahora" cada minuto (solo en Hoy y con la app visible) ---
let temporizadorReloj = 0;
function programarReloj() {
  clearTimeout(temporizadorReloj);
  if (estado.pantalla !== 'hoy' || document.hidden) return;
  const espera = 60000 - (Date.now() % 60000) + 50;
  temporizadorReloj = setTimeout(() => {
    pintarActual();
    programarReloj();
  }, espera);
}
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    pintarActual();
    programarReloj();
  }
});

// --- Eventos de la interfaz ---
botonesBarra.forEach((boton) => {
  boton.addEventListener('click', () => cambiarPantalla(boton.dataset.pantalla));
});
document.getElementById('boton-anadir').addEventListener('click', () => hoja.abrir({ dia: estado.diaVisto }));

// --- Inicio ---
pintarIconos(document);
cambiarPantalla('hoy');

// Funcionamiento sin conexión (requiere HTTPS o localhost)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* sin soporte: la app sigue funcionando */ });
  });
}
