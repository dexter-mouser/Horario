// Comportamiento común de las ventanas emergentes (hoja, turno, plan, alerta):
// abrir/cerrar, foco atrapado, Esc, tocar fuera y devolver el foco al cerrar.
export function crearDialogo({ capa, caja }) {
  let elementoPrevio = null;

  function estaAbierto() {
    return capa.classList.contains('abierta');
  }

  function abrir(foco) {
    elementoPrevio = document.activeElement;
    capa.inert = false;
    capa.classList.add('abierta');
    (foco || caja).focus({ preventScroll: true });
  }

  function cerrar() {
    if (!estaAbierto()) return;
    capa.classList.remove('abierta');
    capa.inert = true;
    if (elementoPrevio && elementoPrevio.focus) elementoPrevio.focus({ preventScroll: true });
  }

  // Tocar fuera de la caja cierra sin aplicar cambios
  capa.addEventListener('click', (evento) => {
    if (evento.target === capa) cerrar();
  });

  // Esc cierra; Tab se mantiene dentro de la caja
  capa.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') {
      evento.preventDefault();
      cerrar();
      return;
    }
    if (evento.key !== 'Tab') return;
    const enfocables = [...caja.querySelectorAll('button, input, textarea, select, [tabindex="0"]')]
      .filter((elemento) => !elemento.hidden && !elemento.disabled && !elemento.closest('[hidden]'));
    if (!enfocables.length) return;
    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];
    if (evento.shiftKey && (document.activeElement === primero || document.activeElement === caja)) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  });

  return { abrir, cerrar, estaAbierto };
}
