// Hoja inferior para añadir y editar eventos.
import { crearFilaDias } from './dias.js';
import { crearSelectorHora } from './rueda.js';
import { ajustarPorFin, ajustarPorInicio, construirEvento, DURACION_POR_DEFECTO, INICIO_POR_DEFECTO } from './nucleo.js';

export function crearHoja({ alGuardar, alBorrar }) {
  const capa = document.getElementById('capa-hoja');
  const hoja = document.getElementById('hoja');
  const titulo = document.getElementById('titulo-hoja');
  const campoTitulo = document.getElementById('hoja-titulo');
  const botonNota = document.getElementById('hoja-boton-nota');
  const campoNota = document.getElementById('hoja-nota');
  const botonBorrar = document.getElementById('hoja-borrar');

  let idEditando = null;
  let diaElegido = 0;
  let elementoPrevio = null;

  // --- Componentes ---
  const filaDias = crearFilaDias(document.getElementById('hoja-dias'), (dia) => { diaElegido = dia; });
  const selectorInicio = crearSelectorHora({ nombre: 'inicio', alCambiar: alMoverInicio });
  const selectorFin = crearSelectorHora({ nombre: 'fin', alCambiar: alMoverFin });
  document.getElementById('hoja-selector-inicio').replaceWith(selectorInicio.elemento);
  document.getElementById('hoja-selector-fin').replaceWith(selectorFin.elemento);

  // --- Reglas de horas (la lógica vive en nucleo.js) ---
  function alMoverInicio(inicio) {
    const horas = ajustarPorInicio(inicio, selectorFin.obtener());
    if (horas.inicio !== inicio) selectorInicio.poner(horas.inicio);
    if (horas.fin !== selectorFin.obtener()) selectorFin.poner(horas.fin);
  }
  function alMoverFin(fin) {
    const horas = ajustarPorFin(selectorInicio.obtener(), fin);
    if (horas.fin !== fin) selectorFin.poner(horas.fin);
  }

  // --- Nota opcional ---
  function mostrarNota(visible) {
    campoNota.hidden = !visible;
    botonNota.hidden = visible;
    botonNota.setAttribute('aria-expanded', String(visible));
  }
  botonNota.addEventListener('click', () => {
    mostrarNota(true);
    campoNota.focus();
  });

  // --- Abrir y cerrar ---
  function abrir({ evento = null, dia }) {
    elementoPrevio = document.activeElement;
    idEditando = evento ? evento.id : null;
    diaElegido = evento ? evento.dia : dia;

    titulo.textContent = evento ? 'Editar evento' : 'Nuevo evento';
    campoTitulo.value = evento ? evento.titulo : '';
    campoNota.value = evento ? evento.nota : '';
    mostrarNota(Boolean(evento && evento.nota));
    botonBorrar.hidden = !evento;

    filaDias.poner(diaElegido);
    selectorInicio.poner(evento ? evento.inicio : INICIO_POR_DEFECTO);
    selectorFin.poner(evento ? evento.fin : INICIO_POR_DEFECTO + DURACION_POR_DEFECTO);

    capa.inert = false;
    capa.classList.add('abierta');
    // Evento nuevo: teclado listo para escribir. Edición: foco en la hoja.
    if (evento) hoja.focus({ preventScroll: true });
    else campoTitulo.focus({ preventScroll: true });
  }

  function cerrar() {
    if (!capa.classList.contains('abierta')) return;
    capa.classList.remove('abierta');
    capa.inert = true;
    if (elementoPrevio && elementoPrevio.focus) elementoPrevio.focus({ preventScroll: true });
  }

  function guardar() {
    const evento = construirEvento({
      id: idEditando,
      titulo: campoTitulo.value,
      dia: diaElegido,
      inicio: selectorInicio.obtener(),
      fin: selectorFin.obtener(),
      nota: campoNota.hidden ? '' : campoNota.value,
    });
    cerrar();
    alGuardar(evento);
  }

  function borrar() {
    const id = idEditando;
    cerrar();
    if (id) alBorrar(id);
  }

  // --- Eventos ---
  document.getElementById('hoja-guardar').addEventListener('click', guardar);
  document.getElementById('hoja-cancelar').addEventListener('click', cerrar);
  botonBorrar.addEventListener('click', borrar);

  // Intro en el título guarda el evento
  campoTitulo.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter' && !evento.isComposing) {
      evento.preventDefault();
      guardar();
    }
  });

  // Tocar fuera de la hoja cierra sin guardar
  capa.addEventListener('click', (evento) => {
    if (evento.target === capa) cerrar();
  });

  // Esc cierra; Tab se mantiene dentro de la hoja
  capa.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') {
      evento.preventDefault();
      cerrar();
      return;
    }
    if (evento.key !== 'Tab') return;
    const enfocables = [...hoja.querySelectorAll('button, input, textarea, [tabindex="0"]')]
      .filter((elemento) => !elemento.hidden && !elemento.disabled);
    if (!enfocables.length) return;
    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];
    if (evento.shiftKey && (document.activeElement === primero || document.activeElement === hoja)) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  });

  return { abrir, cerrar };
}
