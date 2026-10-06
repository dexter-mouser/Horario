// Par de selectores Inicio/Fin con las reglas de horas aplicadas.
// Lo usan la hoja de eventos y la hoja de turnos.
import { crearSelectorHora } from './rueda.js';
import { ajustarPorFin, ajustarPorInicio } from './nucleo.js';

export function crearParHoras({ lugarInicio, lugarFin }) {
  const selectorInicio = crearSelectorHora({ nombre: 'inicio', alCambiar: alMoverInicio });
  const selectorFin = crearSelectorHora({ nombre: 'fin', alCambiar: alMoverFin });
  lugarInicio.replaceWith(selectorInicio.elemento);
  lugarFin.replaceWith(selectorFin.elemento);

  // Mover el inicio puede desplazar el fin (+1 hora)
  function alMoverInicio(inicio) {
    const horas = ajustarPorInicio(inicio, selectorFin.obtener());
    if (horas.inicio !== inicio) selectorInicio.poner(horas.inicio);
    if (horas.fin !== selectorFin.obtener()) selectorFin.poner(horas.fin);
  }

  // Mover el fin por detrás del inicio lo corrige (+5 minutos)
  function alMoverFin(fin) {
    const horas = ajustarPorFin(selectorInicio.obtener(), fin);
    if (horas.fin !== fin) selectorFin.poner(horas.fin);
  }

  return {
    poner(inicio, fin) {
      selectorInicio.poner(inicio);
      selectorFin.poner(fin);
    },
    obtener() {
      return { inicio: selectorInicio.obtener(), fin: selectorFin.obtener() };
    },
  };
}
