// Fondos disponibles. Para añadir uno: crear css/fondos/<id>.css y registrarlo aquí.
// "estandar" es el tema adaptable (modo claro/oscuro y acento elegible);
// los demás son escenas con su propia paleta.
export const FONDOS = [
  { id: 'estandar', nombre: 'Estándar' },
  { id: 'aurora', nombre: 'Aurora' },
  { id: 'vaquero', nombre: 'Vaquero' },
];
export const FONDO_POR_DEFECTO = 'estandar';

// La barra del navegador toma el color de --fondo del fondo activo
export function actualizarColorBarra() {
  const color = getComputedStyle(document.documentElement).getPropertyValue('--fondo').trim();
  const meta = document.querySelector('meta[name="theme-color"]');
  if (color && meta) meta.setAttribute('content', color);
}

// Devuelve el id realmente aplicado (si el guardado no existe, usa el de por defecto).
export function aplicarFondo(identificador) {
  const fondo = FONDOS.find((actual) => actual.id === identificador)
    || FONDOS.find((actual) => actual.id === FONDO_POR_DEFECTO);
  const ruta = 'css/fondos/' + fondo.id + '.css';

  const enlace = document.getElementById('enlace-fondo');
  if (enlace) {
    enlace.addEventListener('load', actualizarColorBarra, { once: true });
    if (enlace.getAttribute('href') !== ruta) enlace.setAttribute('href', ruta);
  }

  document.documentElement.dataset.fondo = fondo.id;
  actualizarColorBarra();
  return fondo.id;
}
