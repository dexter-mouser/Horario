// Grupo de botones excluyentes (ej.: Indefinido | Por una vez).
// Los botones llevan data-valor y aria-pressed en el HTML.
export function crearSegmentado(contenedor, alElegir) {
  const botones = [...contenedor.querySelectorAll('[data-valor]')];

  function poner(valor) {
    botones.forEach((boton) => boton.setAttribute('aria-pressed', String(boton.dataset.valor === valor)));
  }

  contenedor.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-valor]');
    if (!boton) return;
    poner(boton.dataset.valor);
    alElegir(boton.dataset.valor);
  });

  return { poner };
}
