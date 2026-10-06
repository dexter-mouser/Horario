// Hoja para crear, editar y borrar un turno.
import { crearDialogo } from './dialogo.js';
import { crearParHoras } from './horas.js';
import { DURACION_POR_DEFECTO, INICIO_POR_DEFECTO } from './nucleo.js';
import { construirTurno } from './turnos.js';

export function crearHojaTurno({ alGuardar, alBorrar }) {
  const capa = document.getElementById('capa-turno');
  const hoja = document.getElementById('hoja-turno');
  const titulo = document.getElementById('titulo-hoja-turno');
  const campoNombre = document.getElementById('turno-nombre');
  const botonBorrar = document.getElementById('turno-borrar');

  let idEditando = null;

  const dialogo = crearDialogo({ capa, caja: hoja });
  const horas = crearParHoras({
    lugarInicio: document.getElementById('turno-selector-inicio'),
    lugarFin: document.getElementById('turno-selector-fin'),
  });

  function abrir(turno = null) {
    idEditando = turno ? turno.id : null;
    titulo.textContent = turno ? 'Editar turno' : 'Nuevo turno';
    campoNombre.value = turno ? turno.nombre : '';
    botonBorrar.hidden = !turno;
    horas.poner(
      turno ? turno.inicio : INICIO_POR_DEFECTO,
      turno ? turno.fin : INICIO_POR_DEFECTO + DURACION_POR_DEFECTO,
    );
    dialogo.abrir(turno ? hoja : campoNombre);
  }

  function guardar() {
    const { inicio, fin } = horas.obtener();
    const turno = construirTurno({ id: idEditando, nombre: campoNombre.value, inicio, fin });
    dialogo.cerrar();
    alGuardar(turno);
  }

  function borrar() {
    const id = idEditando;
    dialogo.cerrar();
    if (id) alBorrar(id);
  }

  document.getElementById('turno-guardar').addEventListener('click', guardar);
  document.getElementById('turno-cancelar').addEventListener('click', dialogo.cerrar);
  botonBorrar.addEventListener('click', borrar);
  campoNombre.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter' && !evento.isComposing) {
      evento.preventDefault();
      guardar();
    }
  });

  return { abrir };
}
