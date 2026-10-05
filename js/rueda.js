// Selector de rueda: desplazamiento nativo con ajuste (scroll-snap).
// La rueda siempre se detiene sobre una opción; el valor se lee al terminar el gesto.
import { crearElemento } from './dom.js';

const ALTO_OPCION = 40; // px por opción (se pasa a CSS como --alto-opcion)
const ESPERA_FIN_GESTO = 90; // ms sin desplazamiento = el gesto terminó
const HORAS = Array.from({ length: 24 }, (_, numero) => String(numero).padStart(2, '0'));
const MINUTOS = Array.from({ length: 12 }, (_, numero) => String(numero * 5).padStart(2, '0'));

let contadorRuedas = 0;

export function crearRueda({ valores, etiqueta, alCambiar }) {
  const prefijo = 'rueda-' + (contadorRuedas += 1);
  const raiz = crearElemento('div', 'rueda');
  raiz.setAttribute('role', 'listbox');
  raiz.setAttribute('aria-label', etiqueta);
  raiz.tabIndex = 0;
  raiz.style.setProperty('--alto-opcion', ALTO_OPCION + 'px');

  const opciones = valores.map((valor, posicion) => {
    const opcion = crearElemento('div', 'opcion', valor);
    opcion.id = prefijo + '-' + posicion;
    opcion.setAttribute('role', 'option');
    opcion.setAttribute('aria-selected', 'false');
    return opcion;
  });
  raiz.append(...opciones);

  let indice = 0;       // opción confirmada
  let visual = -1;      // opción resaltada
  let temporizador = 0;
  let cuadro = 0;

  function limitar(posicion) {
    return Math.max(0, Math.min(valores.length - 1, posicion));
  }
  function indiceDesdeScroll() {
    return limitar(Math.round(raiz.scrollTop / ALTO_OPCION));
  }

  // Resalta la opción central (solo toca el DOM si cambia)
  function marcar(posicion) {
    if (posicion === visual) return;
    if (visual >= 0) {
      opciones[visual].classList.remove('activa');
      opciones[visual].setAttribute('aria-selected', 'false');
    }
    opciones[posicion].classList.add('activa');
    opciones[posicion].setAttribute('aria-selected', 'true');
    raiz.setAttribute('aria-activedescendant', opciones[posicion].id);
    visual = posicion;
  }

  function terminarGesto() {
    const posicion = indiceDesdeScroll();
    marcar(posicion);
    if (posicion !== indice) {
      indice = posicion;
      if (alCambiar) alCambiar(posicion);
    }
  }

  raiz.addEventListener('scroll', () => {
    if (!cuadro) {
      cuadro = requestAnimationFrame(() => {
        cuadro = 0;
        marcar(indiceDesdeScroll());
      });
    }
    clearTimeout(temporizador);
    temporizador = setTimeout(terminarGesto, ESPERA_FIN_GESTO);
  }, { passive: true });

  // Teclado: flechas, inicio y fin
  raiz.addEventListener('keydown', (evento) => {
    const saltos = { ArrowUp: -1, ArrowDown: 1 };
    let destino = null;
    if (evento.key in saltos) destino = limitar(indice + saltos[evento.key]);
    else if (evento.key === 'Home') destino = 0;
    else if (evento.key === 'End') destino = valores.length - 1;
    if (destino === null) return;
    evento.preventDefault();
    if (destino !== indice) {
      poner(destino);
      if (alCambiar) alCambiar(destino);
    }
  });

  // Coloca la rueda en una opción sin avisar (uso programático)
  function poner(posicion) {
    indice = limitar(posicion);
    marcar(indice);
    raiz.scrollTop = indice * ALTO_OPCION;
  }

  poner(0);
  return { elemento: raiz, obtener: () => indice, poner };
}

// Selector de hora: rueda de horas + ":" + rueda de minutos (de 5 en 5).
export function crearSelectorHora({ nombre, alCambiar }) {
  const raiz = crearElemento('div', 'selector');
  raiz.style.setProperty('--alto-opcion', ALTO_OPCION + 'px');

  const marco = crearElemento('div', 'marco');
  marco.setAttribute('aria-hidden', 'true');

  const avisar = () => alCambiar(obtener());
  const horas = crearRueda({ valores: HORAS, etiqueta: 'Hora de ' + nombre, alCambiar: avisar });
  const minutos = crearRueda({ valores: MINUTOS, etiqueta: 'Minutos de ' + nombre, alCambiar: avisar });
  const separador = crearElemento('span', 'separador', ':');
  separador.setAttribute('aria-hidden', 'true');

  raiz.append(marco, horas.elemento, separador, minutos.elemento);

  function obtener() {
    return horas.obtener() * 60 + minutos.obtener() * 5;
  }
  // total en minutos desde las 00:00 (múltiplo de 5)
  function poner(total) {
    horas.poner(Math.floor(total / 60));
    minutos.poner(Math.round((total % 60) / 5));
  }

  return { elemento: raiz, obtener, poner };
}
