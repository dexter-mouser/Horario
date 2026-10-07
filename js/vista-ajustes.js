// Pantalla "Ajustes": apariencia (modo y acento), fondo y turnos.
import { crearElemento } from './dom.js';
import { crearSegmentado } from './segmentado.js';
import { FONDOS } from './fondos.js';
import { ACENTOS } from './tema.js';
import { MAX_TURNOS, ordenarTurnos } from './turnos.js';
import { formatearHora } from './tiempo.js';

export function crearVistaAjustes({ alElegirFondo, alElegirModo, alElegirAcento, alNuevoTurno, alEditarTurno }) {
  const tarjetaTema = document.getElementById('tarjeta-tema');
  const avisoTema = document.getElementById('aviso-tema');
  const contenedorFondos = document.getElementById('opciones-fondo');
  const contenedorAcentos = document.getElementById('opciones-acento');
  const textoAcento = document.getElementById('acento-actual');
  const listaTurnos = document.getElementById('lista-turnos');
  const botonNuevoTurno = document.getElementById('boton-nuevo-turno');

  // --- Modo: Sistema | Claro | Oscuro ---
  const segmentadoModo = crearSegmentado(document.getElementById('opciones-modo'), alElegirModo);

  // --- Acento: muestras predefinidas + color libre ---
  const botonesAcento = ACENTOS.map((acento) => {
    const boton = crearElemento('button', 'muestra');
    boton.type = 'button';
    boton.dataset.color = acento.color;
    boton.style.background = acento.color;
    boton.title = acento.nombre;
    boton.setAttribute('aria-label', acento.nombre);
    boton.setAttribute('aria-pressed', 'false');
    return boton;
  });
  const etiquetaLibre = crearElemento('label', 'muestra muestra-libre');
  etiquetaLibre.title = 'Color libre';
  const entradaLibre = crearElemento('input');
  entradaLibre.type = 'color';
  entradaLibre.setAttribute('aria-label', 'Color libre');
  etiquetaLibre.append(entradaLibre);
  contenedorAcentos.replaceChildren(...botonesAcento, etiquetaLibre);

  contenedorAcentos.addEventListener('click', (evento) => {
    const boton = evento.target.closest('button[data-color]');
    if (boton) alElegirAcento(boton.dataset.color, true);
  });
  // Mientras se arrastra se ve el cambio al instante; al soltar se guarda
  entradaLibre.addEventListener('input', () => alElegirAcento(entradaLibre.value, false));
  entradaLibre.addEventListener('change', () => alElegirAcento(entradaLibre.value, true));

  // --- Fondos ---
  const botonesFondo = FONDOS.map((fondo) => {
    const boton = crearElemento('button', 'chip', fondo.nombre);
    boton.type = 'button';
    boton.dataset.fondo = fondo.id;
    boton.setAttribute('aria-pressed', 'false');
    return boton;
  });
  contenedorFondos.replaceChildren(...botonesFondo);
  contenedorFondos.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-fondo]');
    if (boton) alElegirFondo(boton.dataset.fondo);
  });

  // --- Turnos ---
  listaTurnos.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-turno]');
    if (boton) alEditarTurno(boton.dataset.turno);
  });
  botonNuevoTurno.addEventListener('click', alNuevoTurno);

  function pintarTurnos(turnos) {
    const fragmento = document.createDocumentFragment();
    if (!turnos.length) {
      fragmento.append(crearElemento('li', 'texto-suave', 'Sin turnos. Añade el primero.'));
    }
    ordenarTurnos(turnos).forEach((turno) => {
      const elemento = crearElemento('li');
      const boton = crearElemento('button', 'fila-turno');
      boton.type = 'button';
      boton.dataset.turno = turno.id;
      boton.append(
        crearElemento('span', 'fila-turno-nombre', turno.nombre),
        crearElemento('span', 'fila-turno-horas', formatearHora(turno.inicio) + ' – ' + formatearHora(turno.fin)),
      );
      elemento.append(boton);
      fragmento.append(elemento);
    });
    listaTurnos.replaceChildren(fragmento);
    botonNuevoTurno.hidden = turnos.length >= MAX_TURNOS;
  }

  function pintarTema({ activo, modo, acento }) {
    // Con una escena de fondo el modo y el acento no aplican: se deshabilita la tarjeta
    tarjetaTema.inert = !activo;
    tarjetaTema.classList.toggle('apagada', !activo);
    avisoTema.hidden = activo;
    segmentadoModo.poner(modo);

    let esPredefinido = false;
    botonesAcento.forEach((boton) => {
      const elegido = boton.dataset.color === acento;
      if (elegido) esPredefinido = true;
      boton.setAttribute('aria-pressed', String(elegido));
    });
    etiquetaLibre.classList.toggle('muestra-activa', !esPredefinido);
    etiquetaLibre.style.background = esPredefinido ? '' : acento;
    if (entradaLibre.value !== acento) entradaLibre.value = acento;

    const predefinido = ACENTOS.find((actual) => actual.color === acento);
    textoAcento.textContent = (predefinido ? predefinido.nombre : 'Libre') + ' · ' + acento;
  }

  function pintar({ fondoActual, turnos, tema }) {
    botonesFondo.forEach((boton) => boton.setAttribute('aria-pressed', String(boton.dataset.fondo === fondoActual)));
    pintarTema(tema);
    pintarTurnos(turnos);
  }

  return { pintar };
}
