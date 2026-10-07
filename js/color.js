// Utilidades de color y contraste (criterio WCAG). Funciones puras, sin DOM.

// Superficies más exigentes de css/fondos/estandar.css (--superficie-2 en cada modo).
// Si cambian en ese archivo, deben cambiar aquí.
const SUPERFICIE_OSCURA = '#1f242d';
const SUPERFICIE_CLARA = '#eceef3';
const TEXTO_OSCURO = '#0b0f14';
const CONTRASTE_MINIMO = 4.5;

// Devuelve "#rrggbb" en minúsculas, o null si el texto no es un color válido
export function normalizarHex(texto) {
  if (typeof texto !== 'string') return null;
  const limpio = texto.trim().toLowerCase();
  return /^#[0-9a-f]{6}$/.test(limpio) ? limpio : null;
}

function canales(hex) {
  return [1, 3, 5].map((posicion) => parseInt(hex.slice(posicion, posicion + 2), 16));
}

function canalesAHex(lista) {
  return '#' + lista
    .map((valor) => Math.round(Math.max(0, Math.min(255, valor))).toString(16).padStart(2, '0'))
    .join('');
}

export function luminancia(hex) {
  const [rojo, verde, azul] = canales(hex).map((valor) => {
    const escala = valor / 255;
    return escala <= 0.03928 ? escala / 12.92 : ((escala + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rojo + 0.7152 * verde + 0.0722 * azul;
}

export function contraste(hexA, hexB) {
  const luzA = luminancia(hexA);
  const luzB = luminancia(hexB);
  return (Math.max(luzA, luzB) + 0.05) / (Math.min(luzA, luzB) + 0.05);
}

// Color de texto para escribir encima de `hex` con contraste mínimo 4.5:1
export function textoSobre(hex) {
  const conOscuro = contraste(hex, TEXTO_OSCURO);
  const conBlanco = contraste(hex, '#ffffff');
  const mejor = Math.max(conOscuro, conBlanco);
  if (mejor >= CONTRASTE_MINIMO) return conOscuro >= conBlanco ? TEXTO_OSCURO : '#ffffff';
  // Zona intermedia: negro o blanco puros siempre superan 4.5:1
  return contraste(hex, '#000000') >= conBlanco ? '#000000' : '#ffffff';
}

// Acerca `hex` al blanco (haciaClaro) o al negro hasta lograr 4.5:1 sobre `fondo`
export function ajustarParaFondo(hex, fondo, haciaClaro) {
  const destino = haciaClaro ? 255 : 0;
  const base = canales(hex);
  for (let paso = 0; paso <= 20; paso += 1) {
    const mezcla = paso / 20;
    const candidato = canalesAHex(base.map((valor) => valor + (destino - valor) * mezcla));
    if (contraste(candidato, fondo) >= CONTRASTE_MINIMO) return candidato;
  }
  return haciaClaro ? '#ffffff' : '#000000';
}

// Todas las variables de color que depende del acento elegido
export function calcularAcento(hex) {
  return {
    acento: hex,                                              // relleno de botones
    sobre: textoSobre(hex),                                   // texto encima del relleno
    textoOscuro: ajustarParaFondo(hex, SUPERFICIE_OSCURA, true),   // acento como texto/borde en modo oscuro
    textoClaro: ajustarParaFondo(hex, SUPERFICIE_CLARA, false),    // acento como texto/borde en modo claro
  };
}
