// Núcleo: reglas de negocio puras (sin DOM ni almacenamiento).
import { sumarSemanas } from './tiempo.js';

export const MINUTOS_DIA = 1440;
export const PASO_MINUTOS = 5;
export const INICIO_MAXIMO = 1430;      // 23:50
export const FIN_MAXIMO = 1435;         // 23:55 (final del día)
export const INICIO_POR_DEFECTO = 540;  // 09:00
export const DURACION_POR_DEFECTO = 60;
export const MAX_TITULO = 60;
export const MAX_NOTA = 500;
export const TITULO_VACIO = 'Sin título';

// Repetición: "indefinido" se conserva cada semana; "una-vez" solo vale en su semana
export const REPETICION_INDEFINIDO = 'indefinido';
export const REPETICION_UNA_VEZ = 'una-vez';
// Origen: eventos creados por "Planificar" (los manuales no llevan origen)
export const ORIGEN_PLAN = 'plan';

const esMultiploDeCinco = (numero) => Number.isInteger(numero) && numero % PASO_MINUTOS === 0;
const esSemanaValida = (texto) => typeof texto === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(texto);

export function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Al mover el INICIO: si el fin queda igual o anterior, pasa a ser 1 hora después.
export function ajustarPorInicio(inicio, fin) {
  const inicioFinal = Math.min(inicio, INICIO_MAXIMO);
  let finFinal = fin;
  if (finFinal <= inicioFinal) {
    finFinal = Math.min(inicioFinal + DURACION_POR_DEFECTO, FIN_MAXIMO);
  }
  return { inicio: inicioFinal, fin: finFinal };
}

// Al mover el FIN: si queda igual o anterior al inicio, pasa a ser 5 minutos después.
export function ajustarPorFin(inicio, fin) {
  let finFinal = fin;
  if (finFinal <= inicio) finFinal = inicio + PASO_MINUTOS;
  return { inicio, fin: Math.min(finFinal, FIN_MAXIMO) };
}

// Crea un evento limpio y con valores válidos.
export function construirEvento({ id, titulo, dia, inicio, fin, nota, repeticion, semana, origen }) {
  const tituloLimpio = String(titulo ?? '').trim().slice(0, MAX_TITULO);
  const notaLimpia = String(nota ?? '').trim().slice(0, MAX_NOTA);
  const porInicio = ajustarPorInicio(inicio, fin);
  const horas = ajustarPorFin(porInicio.inicio, porInicio.fin);

  const evento = {
    id: id || generarId(),
    titulo: tituloLimpio || TITULO_VACIO,
    dia,
    inicio: horas.inicio,
    fin: horas.fin,
    nota: notaLimpia,
    repeticion: repeticion === REPETICION_UNA_VEZ ? REPETICION_UNA_VEZ : REPETICION_INDEFINIDO,
  };
  if (evento.repeticion === REPETICION_UNA_VEZ) evento.semana = semana;
  if (origen === ORIGEN_PLAN) evento.origen = ORIGEN_PLAN;
  return evento;
}

// Valida un dato leído del almacenamiento. Devuelve el evento o null si no sirve.
// Los eventos sin repetición (guardados antes) se tratan como indefinidos.
export function validarEvento(dato) {
  if (!dato || typeof dato !== 'object') return null;
  const { id, titulo, dia, inicio, fin, nota, repeticion, semana, origen } = dato;
  if (typeof id !== 'string' || !id) return null;
  if (!Number.isInteger(dia) || dia < 0 || dia > 6) return null;
  if (!esMultiploDeCinco(inicio) || inicio < 0 || inicio > INICIO_MAXIMO) return null;
  if (!esMultiploDeCinco(fin) || fin <= inicio || fin > FIN_MAXIMO) return null;
  if (repeticion === REPETICION_UNA_VEZ && !esSemanaValida(semana)) return null;
  return construirEvento({
    id: id.slice(0, 40),
    titulo: typeof titulo === 'string' ? titulo : '',
    dia, inicio, fin,
    nota: typeof nota === 'string' ? nota : '',
    repeticion, semana, origen,
  });
}

// Orden: por inicio y, en empate, por fin.
export function ordenarEventos(eventos) {
  return [...eventos].sort((a, b) => a.inicio - b.inicio || a.fin - b.fin);
}

// ¿El evento cuenta en la semana que empieza en `lunes`?
export function esDeLaSemana(evento, lunes) {
  return evento.repeticion === REPETICION_INDEFINIDO || evento.semana === lunes;
}

export function eventosDelDia(eventos, dia, lunes) {
  return ordenarEventos(eventos.filter((evento) => evento.dia === dia && esDeLaSemana(evento, lunes)));
}

// Quita los eventos "una vez" de semanas ya terminadas.
export function limpiarVencidos(eventos, lunesActual) {
  return eventos.filter((evento) => evento.repeticion !== REPETICION_UNA_VEZ || evento.semana >= lunesActual);
}

// Crea o reemplaza (según id) y devuelve una lista nueva.
export function guardarEnLista(elementos, elemento) {
  const posicion = elementos.findIndex((actual) => actual.id === elemento.id);
  const copia = [...elementos];
  if (posicion >= 0) copia[posicion] = elemento;
  else copia.push(elemento);
  return copia;
}

export function quitarDeLista(elementos, id) {
  return elementos.filter((elemento) => elemento.id !== id);
}

// ¿La hora actual cae dentro del evento? (inicio incluido, fin excluido)
export function estaAhora(evento, minutosActuales) {
  return evento.inicio <= minutosActuales && minutosActuales < evento.fin;
}

// --- Fin de día (23:55) ---

export function terminaAlFinalDelDia(evento) {
  return evento.fin === FIN_MAXIMO;
}

// Avisar al guardar un evento nuevo o cuando su fin pasa a ser 23:55
export function debeAvisarFinDeDia(previo, nuevo) {
  return terminaAlFinalDelDia(nuevo) && (!previo || previo.fin !== FIN_MAXIMO);
}

export function diaSiguiente(dia) {
  return (dia + 1) % 7;
}

// Datos para "Crear ahora": evento del día siguiente desde las 00:00.
// Devuelve null si cae fuera de lo permitido (más allá de la semana próxima).
export function continuacionDe(evento, lunesActual) {
  let semana = evento.semana;
  if (evento.repeticion === REPETICION_UNA_VEZ && evento.dia === 6) {
    semana = sumarSemanas(evento.semana, 1); // el domingo continúa el lunes siguiente
    if (semana > sumarSemanas(lunesActual, 1)) return null;
  }
  return {
    titulo: evento.titulo,
    dia: diaSiguiente(evento.dia),
    inicio: 0,
    fin: DURACION_POR_DEFECTO,
    repeticion: evento.repeticion,
    semana,
  };
}
