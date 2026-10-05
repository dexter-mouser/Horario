// Pantalla "Hoy": eventos del día elegido.
import { crearElemento } from './dom.js';
import { crearFilaDias } from './dias.js';
import { eventosDelDia, estaAhora } from './nucleo.js';
import { diaActual, formatearHora, minutosAhora, NOMBRES_DIA, textoFechaHoy } from './tiempo.js';

export function crearVistaHoy({ alEditar, alElegirDia }) {
  const titulo = document.getElementById('titulo-hoy');
  const fecha = document.getElementById('fecha-hoy');
  const lista = document.getElementById('lista-hoy');
  const filaDias = crearFilaDias(document.getElementById('fila-dias-hoy'), alElegirDia);

  // Un solo escuchador para toda la lista
  lista.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-id]');
    if (boton) alEditar(boton.dataset.id);
  });

  function crearTarjeta(evento, esAhora) {
    const elemento = crearElemento('li');
    const boton = crearElemento('button', 'evento' + (esAhora ? ' evento-ahora' : ''));
    boton.type = 'button';
    boton.dataset.id = evento.id;

    const cabecera = crearElemento('div', 'evento-cabecera');
    cabecera.append(crearElemento('span', 'evento-horas', formatearHora(evento.inicio) + ' – ' + formatearHora(evento.fin)));
    if (esAhora) cabecera.append(crearElemento('span', 'etiqueta', 'Ahora'));

    boton.append(cabecera, crearElemento('div', 'evento-titulo', evento.titulo));
    if (evento.nota) boton.append(crearElemento('div', 'evento-nota', evento.nota));
    elemento.append(boton);
    return elemento;
  }

  function pintar(eventos, diaVisto) {
    const esHoy = diaVisto === diaActual();
    titulo.textContent = esHoy ? 'Hoy' : NOMBRES_DIA[diaVisto];
    fecha.textContent = textoFechaHoy();
    filaDias.poner(diaVisto);

    const delDia = eventosDelDia(eventos, diaVisto);
    const ahora = minutosAhora();
    const fragmento = document.createDocumentFragment();

    if (!delDia.length) {
      fragmento.append(crearElemento('li', 'mensaje-vacio', 'Nada este día. Pulsa + para añadir.'));
    }
    delDia.forEach((evento) => fragmento.append(crearTarjeta(evento, esHoy && estaAhora(evento, ahora))));
    lista.replaceChildren(fragmento);
  }

  return { pintar };
}
