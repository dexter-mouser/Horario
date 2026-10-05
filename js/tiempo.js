// Utilidades de días y horas. Las horas se manejan como minutos desde las 00:00.

export const NOMBRES_DIA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const LETRAS_DIA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const formatoFecha = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' });

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
