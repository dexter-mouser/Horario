// Fila de siete botones (L M X J V S D), usada en Hoy y en la hoja de edición.
import { LETRAS_DIA, NOMBRES_DIA } from './tiempo.js';

export function crearFilaDias(contenedor, alElegir) {
  const botones = LETRAS_DIA.map((letra, dia) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'boton-dia';
    boton.textContent = letra;
    boton.dataset.dia = String(dia);
    boton.setAttribute('aria-label', NOMBRES_DIA[dia]);
    boton.setAttribute('aria-pressed', 'false');
    return boton;
  });
  contenedor.replaceChildren(...botones);

  function poner(dia) {
    botones.forEach((boton, posicion) => boton.setAttribute('aria-pressed', String(posicion === dia)));
  }

  // Un solo escuchador para los siete botones
  contenedor.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-dia]');
    if (!boton) return;
    const dia = Number(boton.dataset.dia);
    poner(dia);
    alElegir(dia);
  });

  return { poner };
}
