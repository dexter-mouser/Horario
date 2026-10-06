// Iconos SVG en línea. Heredan el color del tema (currentColor) y llevan aria-label.
const CUERPOS = {
  reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendario: '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
  proxima: '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17M10.5 13.5l3 2.5-3 2.5"/>',
  ajustes: '<circle cx="12" cy="12" r="3.5"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
  mas: '<path d="M12 5v14M5 12h14"/>',
};

function crearIcono(nombre, etiqueta) {
  const grosor = nombre === 'mas' ? 2.6 : 2;
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="' + etiqueta + '"'
    + ' fill="none" stroke="currentColor" stroke-width="' + grosor + '" stroke-linecap="round" stroke-linejoin="round">'
    + CUERPOS[nombre] + '</svg>';
}

// Rellena todos los elementos con data-icono. Los textos son constantes del propio HTML.
export function pintarIconos(raiz) {
  raiz.querySelectorAll('[data-icono]').forEach((lugar) => {
    const nombre = lugar.dataset.icono;
    if (CUERPOS[nombre]) lugar.innerHTML = crearIcono(nombre, lugar.dataset.etiqueta || nombre);
  });
}
