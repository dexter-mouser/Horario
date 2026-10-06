// Service worker: guarda la app en una única caché y la sirve sin conexión.
// Estrategia: responde desde la caché al instante y actualiza en segundo plano,
// por lo que el nombre de la caché no necesita cambiar.
const NOMBRE_CACHE = 'horario-cache';
const ARCHIVOS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'css/fondos/aurora.css',
  'css/fondos/oscuro.css',
  'js/app.js',
  'js/alerta.js',
  'js/almacenamiento.js',
  'js/dialogo.js',
  'js/dias.js',
  'js/dom.js',
  'js/fondo-inicial.js',
  'js/fondos.js',
  'js/hoja.js',
  'js/hoja-turno.js',
  'js/horas.js',
  'js/iconos.js',
  'js/nucleo.js',
  'js/rueda.js',
  'js/segmentado.js',
  'js/tiempo.js',
  'js/turnos.js',
  'js/vista-ajustes.js',
  'js/vista-hoy.js',
  'js/vista-plan.js',
  'js/vista-semana.js',
  'img/icono.svg',
  'img/icono-192.png',
  'img/icono-512.png',
  'img/icono-apple.png',
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(NOMBRE_CACHE).then((cache) => cache.addAll(ARCHIVOS)).then(() => self.skipWaiting())
  );
});

// Borra cachés antiguas
self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((nombres) => Promise.all(nombres.filter((nombre) => nombre !== NOMBRE_CACHE).map((nombre) => caches.delete(nombre))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evento) => {
  const peticion = evento.request;
  if (peticion.method !== 'GET' || new URL(peticion.url).origin !== self.location.origin) return;

  evento.respondWith(caches.open(NOMBRE_CACHE).then(async (cache) => {
    const guardado = await cache.match(peticion, { ignoreSearch: true });
    const red = fetch(peticion)
      .then((respuesta) => {
        if (respuesta.ok) cache.put(peticion, respuesta.clone());
        return respuesta;
      })
      .catch(() => null);

    if (guardado) return guardado;
    const respuesta = await red;
    if (respuesta) return respuesta;
    return peticion.mode === 'navigate' ? cache.match('index.html') : Response.error();
  }));
});
