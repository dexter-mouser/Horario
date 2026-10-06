// Pantalla "Ajustes": fondo y turnos.
import { crearElemento } from './dom.js';
import { FONDOS } from './fondos.js';
import { MAX_TURNOS, ordenarTurnos } from './turnos.js';
import { formatearHora } from './tiempo.js';

export function crearVistaAjustes({ alElegirFondo, alNuevoTurno, alEditarTurno }) {
  const contenedorFondos = document.getElementById('opciones-fondo');
  const listaTurnos = document.getElementById('lista-turnos');
  const botonNuevoTurno = document.getElementById('boton-nuevo-turno');

  // --- Fondos ---
  const botones = FONDOS.map((fondo) => {
    const boton = crearElemento('button', 'chip', fondo.nombre);
    boton.type = 'button';
    boton.dataset.fondo = fondo.id;
    boton.setAttribute('aria-pressed', 'false');
    return boton;
  });
  contenedorFondos.replaceChildren(...botones);

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

  function pintar(fondoActual, turnos) {
    botones.forEach((boton) => boton.setAttribute('aria-pressed', String(boton.dataset.fondo === fondoActual)));
    pintarTurnos(turnos);
  }

  return { pintar };
}
