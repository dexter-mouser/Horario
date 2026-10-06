// Utilidades de días, semanas y horas. Las horas se manejan como minutos desde las 00:00.

export const NOMBRES_DIA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const LETRAS_DIA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const formatoFecha = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' });
const formatoDiaMes = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long' });

// Día actual: 0 = lunes ... 6 = domingo
export function diaActual() {
  return (new Date().getDay() + 6) % 7;
}

export function minutosAhora() {
  const ahora = new Date();
  return ahora.getHours() * 60 + ahora.getMinutes();
}

// 545 -> "09:05"
export function formatearHora(minutos) {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return String(horas).padStart(2, '0') + ':' + String(resto).padStart(2, '0');
}

export function textoFechaHoy() {
  return formatoFecha.format(new Date());
}

// --- Semanas: se identifican por su lunes, como texto "AAAA-MM-DD" (hora local) ---

function fechaATexto(fecha) {
  return fecha.getFullYear() + '-'
    + String(fecha.getMonth() + 1).padStart(2, '0') + '-'
    + String(fecha.getDate()).padStart(2, '0');
}

function textoAFecha(texto) {
  const [anio, mes, dia] = texto.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

// Lunes de la semana de `fecha`, desplazado `semanas` semanas (0 = actual, 1 = próxima)
export function lunesDeLaSemana(fecha = new Date(), semanas = 0) {
  const copia = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  copia.setDate(copia.getDate() - ((copia.getDay() + 6) % 7) + semanas * 7);
  return fechaATexto(copia);
}

export function sumarSemanas(lunes, semanas) {
  const fecha = textoAFecha(lunes);
  fecha.setDate(fecha.getDate() + semanas * 7);
  return fechaATexto(fecha);
}

// "12 – 18 de octubre" o "29 de septiembre – 5 de octubre"
export function rangoSemana(lunes) {
  const inicio = textoAFecha(lunes);
  const fin = textoAFecha(sumarSemanas(lunes, 0));
  fin.setDate(fin.getDate() + 6);
  if (inicio.getMonth() === fin.getMonth()) {
    return inicio.getDate() + ' – ' + formatoDiaMes.format(fin);
  }
  return formatoDiaMes.format(inicio) + ' – ' + formatoDiaMes.format(fin);
}
