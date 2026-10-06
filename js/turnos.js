// Turnos predefinidos y planificación semanal (lógica pura, sin DOM).
import {
  ajustarPorFin, ajustarPorInicio, construirEvento, generarId, INICIO_MAXIMO, FIN_MAXIMO,
  ORIGEN_PLAN, PASO_MINUTOS, REPETICION_UNA_VEZ, terminaAlFinalDelDia,
} from './nucleo.js';

export const MAX_TURNOS = 12;
export const MAX_NOMBRE_TURNO = 30;
export const NOMBRE_TURNO_VACIO = 'Turno';

const esMultiploDeCinco = (numero) => Number.isInteger(numero) && numero % PASO_MINUTOS === 0;

export function construirTurno({ id, nombre, inicio, fin }) {
  const porInicio = ajustarPorInicio(inicio, fin);
  const horas = ajustarPorFin(porInicio.inicio, porInicio.fin);
  const nombreLimpio = String(nombre ?? '').trim().slice(0, MAX_NOMBRE_TURNO);
  return { id: id || generarId(), nombre: nombreLimpio || NOMBRE_TURNO_VACIO, inicio: horas.inicio, fin: horas.fin };
}

// Valida un turno leído del almacenamiento (null si no sirve)
export function validarTurno(dato) {
  if (!dato || typeof dato !== 'object') return null;
  const { id, nombre, inicio, fin } = dato;
  if (typeof id !== 'string' || !id) return null;
  if (!esMultiploDeCinco(inicio) || inicio < 0 || inicio > INICIO_MAXIMO) return null;
  if (!esMultiploDeCinco(fin) || fin <= inicio || fin > FIN_MAXIMO) return null;
  return construirTurno({ id: id.slice(0, 40), nombre: typeof nombre === 'string' ? nombre : '', inicio, fin });
}

export function ordenarTurnos(turnos) {
  return [...turnos].sort((a, b) => a.inicio - b.inicio || a.fin - b.fin);
}

// Aplica un plan semanal.
//  - asignaciones: 7 posiciones (lunes a domingo) con el id de un turno o null (libre)
//  - Reemplaza solo los eventos creados por planes anteriores del mismo tipo
//    (y de la misma semana si es "una vez"). Los eventos manuales no se tocan.
// Devuelve la lista nueva y los días cuyo turno termina a las 23:55.
export function aplicarPlan(eventos, asignaciones, turnos, repeticion, semana) {
  const esUnaVez = repeticion === REPETICION_UNA_VEZ;

  const conservados = eventos.filter((evento) => !(
    evento.origen === ORIGEN_PLAN
    && evento.repeticion === repeticion
    && (!esUnaVez || evento.semana === semana)
  ));

  const nuevos = [];
  const diasFinDeDia = [];
  asignaciones.forEach((idTurno, dia) => {
    const turno = turnos.find((actual) => actual.id === idTurno);
    if (!turno) return; // día libre
    const evento = construirEvento({
      titulo: turno.nombre,
      dia,
      inicio: turno.inicio,
      fin: turno.fin,
      nota: '',
      repeticion,
      semana: esUnaVez ? semana : undefined,
      origen: ORIGEN_PLAN,
    });
    nuevos.push(evento);
    if (terminaAlFinalDelDia(evento)) diasFinDeDia.push(dia);
  });

  return { eventos: [...conservados, ...nuevos], diasFinDeDia };
}
