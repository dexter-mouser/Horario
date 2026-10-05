// Pantalla "Ajustes": elección del fondo.
import { crearElemento } from './dom.js';
import { FONDOS } from './fondos.js';

export function crearVistaAjustes({ alElegirFondo }) {
  const contenedor = document.getElementById('opciones-fondo');

  const botones = FONDOS.map((fondo) => {
    const boton = crearElemento('button', 'chip', fondo.nombre);
    boton.type = 'button';
    boton.dataset.fondo = fondo.id;
    boton.setAttribute('aria-pressed', 'false');
    return boton;
  });
  contenedor.replaceChildren(...botones);

  contenedor.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-fondo]');
    if (boton) alElegirFondo(boton.dataset.fondo);
  });

  function pintar(fondoActual) {
    botones.forEach((boton) => boton.setAttribute('aria-pressed', String(boton.dataset.fondo === fondoActual)));
  }

  return { pintar };
}
