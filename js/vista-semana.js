// Pantalla "Semana": una tarjeta por día con su franja de ocupación.
import { crearElemento } from './dom.js';
import { eventosDelDia, MINUTOS_DIA } from './nucleo.js';
import { diaActual, formatearHora, NOMBRES_DIA } from './tiempo.js';

const MARCAS_HORAS = ['00', '06', '12', '18', '24'];

function textoConteo(cantidad) {
  return cantidad + (cantidad === 1 ? ' evento' : ' eventos');
}

// Barra de 24 h: tramos rellenos = ocupado, huecos = libre
function crearFranja(eventosDia) {
  const bloque = crearElemento('div', 'franja-bloque');
  const franja = crearElemento('div', 'franja');
  franja.setAttribute('role', 'img');
  franja.setAttribute('aria-label', eventosDia.length
    ? 'Ocupado: ' + eventosDia.map((e) => formatearHora(e.inicio) + ' a ' + formatearHora(e.fin)).join(', ')
    : 'Sin eventos');

  eventosDia.forEach((evento) => {
    const tramo = crearElemento('div', 'tramo');
    tramo.style.left = (evento.inicio / MINUTOS_DIA * 100) + '%';
    tramo.style.width = ((evento.fin - evento.inicio) / MINUTOS_DIA * 100) + '%';
    franja.append(tramo);
  });

  const horas = crearElemento('div', 'franja-horas');
  horas.setAttribute('aria-hidden', 'true');
  MARCAS_HORAS.forEach((marca) => horas.append(crearElemento('span', '', marca)));

  bloque.append(franja, horas);
  return bloque;
}

export function crearVistaSemana({ alEditar, alIrADia }) {
  const contenedor = document.getElementById('lista-semana');

  // Un solo escuchador: evento -> edición, cabecera -> abrir ese día
  contenedor.addEventListener('click', (evento) => {
    const fila = evento.target.closest('[data-id]');
    if (fila) { alEditar(fila.dataset.id); return; }
    const cabecera = evento.target.closest('[data-dia]');
    if (cabecera) alIrADia(Number(cabecera.dataset.dia));
  });

  function pintar(eventos) {
    const hoy = diaActual();
    const fragmento = document.createDocumentFragment();

    NOMBRES_DIA.forEach((nombre, dia) => {
      const eventosDia = eventosDelDia(eventos, dia);
      const tarjeta = crearElemento('article', 'tarjeta' + (dia === hoy ? ' tarjeta-hoy' : ''));

      const encabezado = crearElemento('h2', 'cabecera-titulo');
      const boton = crearElemento('button', 'cabecera-dia');
      boton.type = 'button';
      boton.dataset.dia = String(dia);
      boton.append(crearElemento('span', 'dia-nombre', nombre));
      if (dia === hoy) boton.append(crearElemento('span', 'etiqueta', 'Hoy'));
      boton.append(crearElemento('span', 'dia-conteo', textoConteo(eventosDia.length)));
      encabezado.append(boton);

      tarjeta.append(encabezado, crearFranja(eventosDia));

      if (!eventosDia.length) {
        tarjeta.append(crearElemento('p', 'libre', 'Libre'));
      }
      eventosDia.forEach((evento) => {
        const fila = crearElemento('button', 'fila-evento');
        fila.type = 'button';
        fila.dataset.id = evento.id;
        fila.append(
          crearElemento('span', 'fila-hora', formatearHora(evento.inicio) + ' – ' + formatearHora(evento.fin)),
          crearElemento('span', 'fila-titulo', evento.titulo),
        );
        tarjeta.append(fila);
      });

      fragmento.append(tarjeta);
    });

    contenedor.replaceChildren(fragmento);
  }

  return { pintar };
}
