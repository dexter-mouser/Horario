// Hoja inferior para añadir y editar eventos.
import { crearDialogo } from './dialogo.js';
import { crearFilaDias } from './dias.js';
import { crearParHoras } from './horas.js';
import { crearSegmentado } from './segmentado.js';
import { crearElemento } from './dom.js';
import {
  construirEvento, DURACION_POR_DEFECTO, INICIO_POR_DEFECTO,
  REPETICION_INDEFINIDO, REPETICION_UNA_VEZ,
} from './nucleo.js';
import { ordenarTurnos } from './turnos.js';
import { formatearHora } from './tiempo.js';

export function crearHoja({ alGuardar, alBorrar, obtenerTurnos }) {
  const capa = document.getElementById('capa-hoja');
  const hoja = document.getElementById('hoja');
  const titulo = document.getElementById('titulo-hoja');
  const campoTitulo = document.getElementById('hoja-titulo');
  const botonNota = document.getElementById('hoja-boton-nota');
  const campoNota = document.getElementById('hoja-nota');
  const botonBorrar = document.getElementById('hoja-borrar');
  const contenedorTurnos = document.getElementById('hoja-turnos');

  let idEditando = null;
  let diaElegido = 0;
  let repeticionElegida = REPETICION_INDEFINIDO;
  let semanaDestino = null; // lunes de la semana (solo importa para "Por una vez")

  // --- Componentes ---
  const dialogo = crearDialogo({ capa, caja: hoja });
  const filaDias = crearFilaDias(document.getElementById('hoja-dias'), (dia) => { diaElegido = dia; });
  const segmentado = crearSegmentado(document.getElementById('hoja-repeticion'), (valor) => { repeticionElegida = valor; });
  const horas = crearParHoras({
    lugarInicio: document.getElementById('hoja-selector-inicio'),
    lugarFin: document.getElementById('hoja-selector-fin'),
  });

  // --- Turnos: un toque rellena las horas (y el título si está vacío) ---
  function pintarTurnos() {
    const turnos = ordenarTurnos(obtenerTurnos());
    contenedorTurnos.hidden = !turnos.length;
    contenedorTurnos.replaceChildren(...turnos.map((turno) => {
      const boton = crearElemento('button', 'chip',
        turno.nombre + ' · ' + formatearHora(turno.inicio) + '–' + formatearHora(turno.fin));
      boton.type = 'button';
      boton.dataset.turno = turno.id;
      return boton;
    }));
  }
  contenedorTurnos.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-turno]');
    if (!boton) return;
    const turno = obtenerTurnos().find((actual) => actual.id === boton.dataset.turno);
    if (!turno) return;
    horas.poner(turno.inicio, turno.fin);
    if (!campoTitulo.value.trim()) campoTitulo.value = turno.nombre;
  });

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

  // --- Abrir y guardar ---
  // evento: edita uno existente · borrador: datos para uno nuevo ("Crear ahora")
  // dia y semana: valores por defecto según la pantalla desde la que se abre
  function abrir({ evento = null, borrador = null, dia, semana }) {
    const base = evento || borrador;
    idEditando = evento ? evento.id : null;
    diaElegido = base ? base.dia : dia;
    repeticionElegida = base ? base.repeticion : REPETICION_INDEFINIDO;
    semanaDestino = (base && base.semana) || semana;

    titulo.textContent = evento ? 'Editar evento' : 'Nuevo evento';
    campoTitulo.value = base ? base.titulo : '';
    campoNota.value = evento ? evento.nota : '';
    mostrarNota(Boolean(evento && evento.nota));
    botonBorrar.hidden = !evento;

    filaDias.poner(diaElegido);
    segmentado.poner(repeticionElegida);
    pintarTurnos();
    horas.poner(
      base ? base.inicio : INICIO_POR_DEFECTO,
      base ? base.fin : INICIO_POR_DEFECTO + DURACION_POR_DEFECTO,
    );

    // Evento nuevo: teclado listo para escribir. Edición: foco en la hoja.
    dialogo.abrir(evento ? hoja : campoTitulo);
  }

  function guardar() {
    const { inicio, fin } = horas.obtener();
    // Un evento guardado a mano no conserva la marca de plan
    const evento = construirEvento({
      id: idEditando,
      titulo: campoTitulo.value,
      dia: diaElegido,
      inicio,
      fin,
      nota: campoNota.hidden ? '' : campoNota.value,
      repeticion: repeticionElegida,
      semana: repeticionElegida === REPETICION_UNA_VEZ ? semanaDestino : undefined,
    });
    dialogo.cerrar();
    alGuardar(evento);
  }

  function borrar() {
    const id = idEditando;
    dialogo.cerrar();
    if (id) alBorrar(id);
  }

  // --- Eventos ---
  document.getElementById('hoja-guardar').addEventListener('click', guardar);
  document.getElementById('hoja-cancelar').addEventListener('click', dialogo.cerrar);
  botonBorrar.addEventListener('click', borrar);

  // Intro en el título guarda el evento
  campoTitulo.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter' && !evento.isComposing) {
      evento.preventDefault();
      guardar();
    }
  });

  return { abrir, cerrar: dialogo.cerrar };
}
