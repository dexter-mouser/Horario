// Fondos disponibles. Para añadir uno: crear css/fondos/<id>.css y registrarlo aquí.
export const FONDOS = [
  { id: 'oscuro', nombre: 'Oscuro', colorBarra: '#02060f' },
];
export const FONDO_POR_DEFECTO = 'oscuro';

// Devuelve el id realmente aplicado (si el guardado no existe, usa el de por defecto).
export function aplicarFondo(identificador) {
  const fondo = FONDOS.find((actual) => actual.id === identificador)
    || FONDOS.find((actual) => actual.id === FONDO_POR_DEFECTO);
  const ruta = 'css/fondos/' + fondo.id + '.css';

  const enlace = document.getElementById('enlace-fondo');
  if (enlace && enlace.getAttribute('href') !== ruta) enlace.setAttribute('href', ruta);

  document.documentElement.dataset.fondo = fondo.id;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', fondo.colorBarra);
  return fondo.id;
}
