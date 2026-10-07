// Arranque y coordinación de pantallas.
import { aplicarFondo, FONDO_POR_DEFECTO } from './fondos.js';
import {
  guardarEventos, guardarFondo, guardarTurnos, leerEventos, leerFondo, leerTurnos,
} from './almacenamiento.js';
import {
  continuacionDe, debeAvisarFinDeDia, guardarEnLista, limpiarVencidos, quitarDeLista,
  REPETICION_UNA_VEZ, diaSiguiente,
} from './nucleo.js';
import { aplicarPlan } from './turnos.js';
import { diaActual, lunesDeLaSemana, NOMBRES_DIA, sumarSemanas } from './tiempo.js';
import { pintarIconos } from './iconos.js';
import { crearTema } from './tema.js';
import { crearAlerta } from './alerta.js';
import { crearHoja } from './hoja.js';
import { crearHojaTurno } from './hoja-turno.js';
import { crearVistaPlan } from './vista-plan.js';
import { crearVistaHoy } from './vista-hoy.js';
import { crearVistaSemana } from './vista-semana.js';
import { crearVistaAjustes } from './vista-ajustes.js';

// --- Estado de la aplicación ---
const estado = {
  eventos: leerEventos(),
  turnos: leerTurnos(),
  lunes: lunesDeLaSemana(),   // lunes de la semana actual
  diaVisto: diaActual(),
  pantalla: 'hoy',
  fondo: aplicarFondo(leerFondo() || FONDO_POR_DEFECTO),
};

const secciones = {
  hoy: document.getElementById('pantalla-hoy'),
  semana: document.getElementById('pantalla-semana'),
  proxima: document.getElementById('pantalla-proxima'),
  ajustes: document.getElementById('pantalla-ajustes'),
};
const botonesBarra = document.querySelectorAll('.boton-barra');

const lunesProximo = () => sumarSemanas(estado.lunes, 1);
// Semana a la que pertenecen los eventos nuevos según la pantalla abierta
const semanaDeLaPantalla = () => (estado.pantalla === 'proxima' ? lunesProximo() : estado.lunes);

// --- Semanas: los eventos "Por una vez" se pierden al terminar su semana ---
function purgarVencidos() {
  const vigentes = limpiarVencidos(estado.eventos, estado.lunes);
  if (vigentes.length !== estado.eventos.length) {
    estado.eventos = vigentes;
    guardarEventos(vigentes);
  }
}

// --- Avisos de fin de día (23:55) ---
function avisarFinDeDia(evento) {
  const continuacion = continuacionDe(evento, estado.lunes);
  const siguiente = NOMBRES_DIA[diaSiguiente(evento.dia)].toLowerCase();
  alerta.mostrar({
    titulo: 'Fin del día',
    mensaje: 'Este horario llega hasta las 23:55. Si continúa pasada la medianoche, crea un evento para el '
      + siguiente + '.',
    textoAccion: 'Crear ahora',
    alAccion: continuacion ? () => hoja.abrir({ borrador: continuacion, semana: semanaDeLaPantalla() }) : null,
  });
}

function avisarPlanFinDeDia(dias) {
  const nombres = dias.map((dia) => NOMBRES_DIA[dia]).join(', ');
  alerta.mostrar({
    titulo: 'Fin del día',
    mensaje: 'Estos días terminan a las 23:55: ' + nombres
      + '. Si continúan pasada la medianoche, crea los eventos del día siguiente.',
  });
}

// --- Acciones: eventos ---
function editarEvento(id) {
  const evento = estado.eventos.find((actual) => actual.id === id);
  if (evento) hoja.abrir({ evento, dia: evento.dia, semana: semanaDeLaPantalla() });
}

function guardarEvento(evento) {
  const previo = estado.eventos.find((actual) => actual.id === evento.id);
  estado.eventos = guardarEnLista(estado.eventos, evento);
  guardarEventos(estado.eventos);
  if (estado.pantalla === 'hoy' && (evento.repeticion !== REPETICION_UNA_VEZ || evento.semana === estado.lunes)) {
    estado.diaVisto = evento.dia; // se muestra el día donde quedó
  }
  pintarActual();
  if (debeAvisarFinDeDia(previo, evento)) avisarFinDeDia(evento);
}

function borrarEvento(id) {
  estado.eventos = quitarDeLista(estado.eventos, id);
  guardarEventos(estado.eventos);
  pintarActual();
}

// --- Acciones: navegación ---
function elegirDia(dia) {
  estado.diaVisto = dia;
  pintarActual();
}

function irADia(dia) {
  estado.diaVisto = dia;
  cambiarPantalla('hoy');
}

// --- Acciones: apariencia ---
function elegirFondo(identificador) {
  estado.fondo = aplicarFondo(identificador);
  guardarFondo(estado.fondo);
  tema.aplicarFondo(estado.fondo === 'estandar'); // avisa y repinta
}

// Botón de la cabecera: alterna entre claro y oscuro de forma manual
function alternarModo() {
  tema.elegirModo(tema.estado().modoResuelto === 'oscuro' ? 'claro' : 'oscuro');
}

// Se ejecuta cada vez que cambia el modo, el acento o el fondo
function refrescarTema() {
  const { activo, modoResuelto } = tema.estado();
  vistaHoy.pintarBotonModo({ visible: activo, modoResuelto });
  pintarAjustes();
}

// --- Acciones: turnos ---
function guardarTurno(turno) {
  estado.turnos = guardarEnLista(estado.turnos, turno);
  guardarTurnos(estado.turnos);
  pintarAjustes();
}

function borrarTurno(id) {
  estado.turnos = quitarDeLista(estado.turnos, id);
  guardarTurnos(estado.turnos);
  pintarAjustes();
}

function editarTurno(id) {
  const turno = estado.turnos.find((actual) => actual.id === id);
  if (turno) hojaTurno.abrir(turno);
}

// --- Acciones: planificar semana ---
function abrirPlan(desplazamiento) {
  vistaPlan.abrir({
    lunes: desplazamiento === 0 ? estado.lunes : lunesProximo(),
    textoTitulo: desplazamiento === 0 ? 'Planificar semana actual' : 'Planificar semana próxima',
  });
}

function aplicarPlanSemanal({ asignaciones, repeticion, semana }) {
  const resultado = aplicarPlan(estado.eventos, asignaciones, estado.turnos, repeticion, semana);
  estado.eventos = resultado.eventos;
  guardarEventos(estado.eventos);
  pintarActual();
  if (resultado.diasFinDeDia.length) avisarPlanFinDeDia(resultado.diasFinDeDia);
}

// --- Componentes ---
const tema = crearTema({ alCambiar: refrescarTema });
const alerta = crearAlerta();
const hoja = crearHoja({ alGuardar: guardarEvento, alBorrar: borrarEvento, obtenerTurnos: () => estado.turnos });
const hojaTurno = crearHojaTurno({ alGuardar: guardarTurno, alBorrar: borrarTurno });
const vistaPlan = crearVistaPlan({ obtenerTurnos: () => estado.turnos, alAplicar: aplicarPlanSemanal });
const vistaHoy = crearVistaHoy({ alEditar: editarEvento, alElegirDia: elegirDia, alCambiarModo: alternarModo });
const vistaSemana = crearVistaSemana({
  idLista: 'lista-semana', idRango: 'rango-semana', desplazamiento: 0, alEditar: editarEvento, alIrADia: irADia,
});
const vistaProxima = crearVistaSemana({
  idLista: 'lista-proxima', idRango: 'rango-proxima', desplazamiento: 1, alEditar: editarEvento, alIrADia: null,
});
const vistaAjustes = crearVistaAjustes({
  alElegirFondo: elegirFondo,
  alElegirModo: (modo) => tema.elegirModo(modo),
  alElegirAcento: (color, persistir) => tema.elegirAcento(color, persistir),
  alNuevoTurno: () => hojaTurno.abrir(),
  alEditarTurno: editarTurno,
});

// --- Pintado: solo se dibuja la pantalla visible ---
function pintarAjustes() {
  vistaAjustes.pintar({ fondoActual: estado.fondo, turnos: estado.turnos, tema: tema.estado() });
}

function pintarActual() {
  if (estado.pantalla === 'hoy') vistaHoy.pintar(estado.eventos, estado.diaVisto);
  else if (estado.pantalla === 'semana') vistaSemana.pintar(estado.eventos);
  else if (estado.pantalla === 'proxima') vistaProxima.pintar(estado.eventos);
  else pintarAjustes();
}

function cambiarPantalla(nombre) {
  estado.pantalla = nombre;
  Object.entries(secciones).forEach(([clave, seccion]) => { seccion.hidden = clave !== nombre; });
  botonesBarra.forEach((boton) => {
    if (boton.dataset.pantalla === nombre) boton.setAttribute('aria-current', 'page');
    else boton.removeAttribute('aria-current');
  });
  revisarSemana();
  pintarActual();
  programarReloj();
}

// --- Reloj: cada minuto actualiza "Ahora" y detecta el cambio de semana (lunes 00:00) ---
function revisarSemana() {
  const lunes = lunesDeLaSemana();
  if (lunes === estado.lunes) return false;
  estado.lunes = lunes;   // la semana próxima pasa a ser la actual
  purgarVencidos();       // se pierden los "Por una vez" de la semana que terminó
  return true;
}

let temporizadorReloj = 0;
function programarReloj() {
  clearTimeout(temporizadorReloj);
  if (document.hidden) return;
  const espera = 60000 - (Date.now() % 60000) + 50;
  temporizadorReloj = setTimeout(() => {
    const cambioSemana = revisarSemana();
    if (cambioSemana || estado.pantalla === 'hoy') pintarActual();
    programarReloj();
  }, espera);
}
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    revisarSemana();
    pintarActual();
    programarReloj();
  }
});

// --- Eventos de la interfaz ---
botonesBarra.forEach((boton) => {
  boton.addEventListener('click', () => cambiarPantalla(boton.dataset.pantalla));
});
document.querySelectorAll('[data-planificar]').forEach((boton) => {
  boton.addEventListener('click', () => abrirPlan(Number(boton.dataset.planificar)));
});
document.getElementById('boton-anadir').addEventListener('click', () => {
  hoja.abrir({ dia: estado.diaVisto, semana: semanaDeLaPantalla() });
});

// --- Inicio ---
purgarVencidos();
pintarIconos(document);
tema.aplicarFondo(estado.fondo === 'estandar');
cambiarPantalla('hoy');

// Funcionamiento sin conexión (requiere HTTPS o localhost)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* sin soporte: la app sigue funcionando */ });
  });
}
