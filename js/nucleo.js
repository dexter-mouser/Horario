// Núcleo: reglas de negocio puras (sin DOM ni almacenamiento).

export const MINUTOS_DIA = 1440;
export const PASO_MINUTOS = 5;
export const INICIO_MAXIMO = 1430;      // 23:50
export const FIN_MAXIMO = 1435;         // 23:55
export const INICIO_POR_DEFECTO = 540;  // 09:00
export const DURACION_POR_DEFECTO = 60;
export const MAX_TITULO = 60;
export const MAX_NOTA = 500;
export const TITULO_VACIO = 'Sin título';

const esMultiploDeCinco = (numero) => Number.isInteger(numero) && numero % PASO_MINUTOS === 0;

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
export function construirEvento({ id, titulo, dia, inicio, fin, nota }) {
  const tituloLimpio = String(titulo ?? '').trim().slice(0, MAX_TITULO);
  const notaLimpia = String(nota ?? '').trim().slice(0, MAX_NOTA);
  const porInicio = ajustarPorInicio(inicio, fin);
  const horas = ajustarPorFin(porInicio.inicio, porInicio.fin);
  return {
    id: id || generarId(),
    titulo: tituloLimpio || TITULO_VACIO,
    dia,
    inicio: horas.inicio,
    fin: horas.fin,
    nota: notaLimpia,
  };
}

// Valida un dato leído del almacenamiento. Devuelve el evento o null si no sirve.
export function validarEvento(dato) {
  if (!dato || typeof dato !== 'object') return null;
  const { id, titulo, dia, inicio, fin, nota } = dato;
  if (typeof id !== 'string' || !id) return null;
  if (!Number.isInteger(dia) || dia < 0 || dia > 6) return null;
  if (!esMultiploDeCinco(inicio) || inicio < 0 || inicio > INICIO_MAXIMO) return null;
  if (!esMultiploDeCinco(fin) || fin <= inicio || fin > FIN_MAXIMO) return null;
  return construirEvento({
    id: id.slice(0, 40),
    titulo: typeof titulo === 'string' ? titulo : '',
    dia, inicio, fin,
    nota: typeof nota === 'string' ? nota : '',
  });
}

// Orden: por inicio y, en empate, por fin.
export function ordenarEventos(eventos) {
  return [...eventos].sort((a, b) => a.inicio - b.inicio || a.fin - b.fin);
}

export function eventosDelDia(eventos, dia) {
  return ordenarEventos(eventos.filter((evento) => evento.dia === dia));
}

// Crea o reemplaza (según id) y devuelve una lista nueva.
export function guardarEnLista(eventos, evento) {
  const posicion = eventos.findIndex((actual) => actual.id === evento.id);
  const copia = [...eventos];
  if (posicion >= 0) copia[posicion] = evento;
  else copia.push(evento);
  return copia;
}

export function quitarDeLista(eventos, id) {
  return eventos.filter((evento) => evento.id !== id);
}

// ¿La hora actual cae dentro del evento? (inicio incluido, fin excluido)
export function estaAhora(evento, minutosActuales) {
  return evento.inicio <= minutosActuales && minutosActuales < evento.fin;
}
