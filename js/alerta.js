// Aviso emergente propio de la app (no usa notificaciones del sistema).
import { crearDialogo } from './dialogo.js';

export function crearAlerta() {
  const capa = document.getElementById('capa-alerta');
  const caja = document.getElementById('alerta');
  const titulo = document.getElementById('alerta-titulo');
  const mensaje = document.getElementById('alerta-mensaje');
  const botonAceptar = document.getElementById('alerta-aceptar');
  const botonAccion = document.getElementById('alerta-accion');
  const dialogo = crearDialogo({ capa, caja });
  let accionPendiente = null;

  // Muestra el aviso; con `alAccion` aparece un segundo botón (ej.: "Crear ahora")
  function mostrar({ titulo: textoTitulo, mensaje: textoMensaje, textoAccion, alAccion }) {
    titulo.textContent = textoTitulo;
    mensaje.textContent = textoMensaje;
    accionPendiente = alAccion || null;
    botonAccion.hidden = !alAccion;
    if (alAccion) botonAccion.textContent = textoAccion;
    dialogo.abrir(botonAceptar);
  }

  botonAceptar.addEventListener('click', () => dialogo.cerrar());
  botonAccion.addEventListener('click', () => {
    const accion = accionPendiente;
    dialogo.cerrar();
    if (accion) accion();
  });

  return { mostrar };
}
