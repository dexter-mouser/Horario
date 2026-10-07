// Iconos SVG en línea. Heredan el color del tema (currentColor) y llevan aria-label.
const CUERPOS = {
  reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendario: '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
  proxima: '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17M10.5 13.5l3 2.5-3 2.5"/>',
  ajustes: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  mas: '<path d="M12 5v14M5 12h14"/>',
  sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
  luna: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z"/>',
};

function crearIcono(nombre, etiqueta) {
  const grosor = nombre === 'mas' ? 2.6 : 2;
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="' + etiqueta + '"'
    + ' fill="none" stroke="currentColor" stroke-width="' + grosor + '" stroke-linecap="round" stroke-linejoin="round">'
    + CUERPOS[nombre] + '</svg>';
}

// Pone un icono dentro de `lugar`. Los textos son constantes del propio código.
export function ponerIcono(lugar, nombre, etiqueta) {
  if (CUERPOS[nombre]) lugar.innerHTML = crearIcono(nombre, etiqueta || nombre);
}

// Rellena todos los elementos con data-icono
export function pintarIconos(raiz) {
  raiz.querySelectorAll('[data-icono]').forEach((lugar) => {
    ponerIcono(lugar, lugar.dataset.icono, lugar.dataset.etiqueta);
  });
}
