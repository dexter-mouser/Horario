// Hoja "Planificar semana": un turno (o libre) por día y se crean todos los eventos.
import { crearDialogo } from './dialogo.js';
import { crearElemento } from './dom.js';
import { crearSegmentado } from './segmentado.js';
import { REPETICION_INDEFINIDO } from './nucleo.js';
import { ordenarTurnos } from './turnos.js';
import { formatearHora, NOMBRES_DIA } from './tiempo.js';

export function crearVistaPlan({ obtenerTurnos, alAplicar }) {
  const capa = document.getElementById('capa-plan');
  const caja = document.getElementById('hoja-plan');
  const titulo = document.getElementById('plan-titulo');
  const aviso = document.getElementById('plan-aviso');
  const contenedorDias = document.getElementById('plan-dias');
  const contenedorRepeticion = document.getElementById('plan-repeticion');
  const botonAplicar = document.getElementById('plan-aplicar');

  const dialogo = crearDialogo({ capa, caja });
  let repeticion = REPETICION_INDEFINIDO;
  let semana = null;
  let selectores = [];

  const segmentado = crearSegmentado(contenedorRepeticion, (valor) => { repeticion = valor; });

  function crearFila(dia, turnos) {
    const fila = crearElemento('div', 'plan-fila');
    const etiqueta = crearElemento('label', '', NOMBRES_DIA[dia]);
    const selector = crearElemento('select', 'campo');
    selector.id = 'plan-dia-' + dia;
    etiqueta.htmlFor = selector.id;

    selector.append(new Option('Libre', ''));
    turnos.forEach((turno) => {
      selector.append(new Option(
        turno.nombre + ' (' + formatearHora(turno.inicio) + '–' + formatearHora(turno.fin) + ')',
        turno.id,
      ));
    });
    fila.append(etiqueta, selector);
    return { fila, selector };
  }

  // lunes: semana a la que se aplica · textoTitulo: "Planificar semana actual/próxima"
  function abrir({ lunes, textoTitulo }) {
    semana = lunes;
    repeticion = REPETICION_INDEFINIDO;
    segmentado.poner(repeticion);
    titulo.textContent = textoTitulo;

    const turnos = ordenarTurnos(obtenerTurnos());
    const hayTurnos = turnos.length > 0;
    contenedorDias.hidden = !hayTurnos;
    contenedorRepeticion.hidden = !hayTurnos;
    botonAplicar.hidden = !hayTurnos;
    aviso.textContent = hayTurnos
      ? 'Elige un turno para cada día. Reemplaza los eventos de planes anteriores del mismo tipo; tus eventos manuales no se tocan.'
      : 'Aún no tienes turnos. Créalos en Ajustes.';

    const filas = NOMBRES_DIA.map((_, dia) => crearFila(dia, turnos));
    selectores = filas.map((fila) => fila.selector);
    contenedorDias.replaceChildren(...filas.map((fila) => fila.fila));
    dialogo.abrir(hayTurnos ? selectores[0] : caja);
  }

  botonAplicar.addEventListener('click', () => {
    const asignaciones = selectores.map((selector) => selector.value || null);
    dialogo.cerrar();
    alAplicar({ asignaciones, repeticion, semana });
  });
  document.getElementById('plan-cancelar').addEventListener('click', dialogo.cerrar);

  return { abrir };
}
