// Pantallas "Semana" y "Semana próxima": una tarjeta por día con su franja de ocupación.
// Es la misma vista; `desplazamiento` indica la semana (0 = actual, 1 = próxima).
import { crearElemento } from './dom.js';
import { eventosDelDia, MINUTOS_DIA, REPETICION_UNA_VEZ } from './nucleo.js';
import { diaActual, formatearHora, lunesDeLaSemana, NOMBRES_DIA, rangoSemana } from './tiempo.js';

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

export function crearVistaSemana({ idLista, idRango, desplazamiento, alEditar, alIrADia }) {
  const contenedor = document.getElementById(idLista);
  const rango = document.getElementById(idRango);

  // Un solo escuchador: evento -> edición, cabecera -> abrir ese día (solo semana actual)
  contenedor.addEventListener('click', (evento) => {
    const fila = evento.target.closest('[data-id]');
    if (fila) { alEditar(fila.dataset.id); return; }
    const cabecera = evento.target.closest('[data-dia]');
    if (cabecera && alIrADia) alIrADia(Number(cabecera.dataset.dia));
  });

  function crearCabecera(nombre, dia, esHoy, cantidad) {
    const encabezado = crearElemento('h2', 'cabecera-titulo');
    // En la semana actual la cabecera abre el día; en la próxima es solo texto
    const cabecera = crearElemento(desplazamiento === 0 ? 'button' : 'span', 'cabecera-dia');
    if (desplazamiento === 0) {
      cabecera.type = 'button';
      cabecera.dataset.dia = String(dia);
    }
    cabecera.append(crearElemento('span', 'dia-nombre', nombre));
    if (esHoy) cabecera.append(crearElemento('span', 'etiqueta', 'Hoy'));
    cabecera.append(crearElemento('span', 'dia-conteo', textoConteo(cantidad)));
    encabezado.append(cabecera);
    return encabezado;
  }

  function pintar(eventos) {
    const lunes = lunesDeLaSemana(new Date(), desplazamiento);
    rango.textContent = rangoSemana(lunes);
    const hoy = desplazamiento === 0 ? diaActual() : -1;
    const fragmento = document.createDocumentFragment();

    NOMBRES_DIA.forEach((nombre, dia) => {
      const eventosDia = eventosDelDia(eventos, dia, lunes);
      const tarjeta = crearElemento('article', 'tarjeta' + (dia === hoy ? ' tarjeta-hoy' : ''));
      tarjeta.append(crearCabecera(nombre, dia, dia === hoy, eventosDia.length), crearFranja(eventosDia));

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
        if (evento.repeticion === REPETICION_UNA_VEZ) fila.append(crearElemento('span', 'marca-una-vez', 'Una vez'));
        tarjeta.append(fila);
      });

      fragmento.append(tarjeta);
    });

    contenedor.replaceChildren(fragmento);
  }

  return { pintar };
}
