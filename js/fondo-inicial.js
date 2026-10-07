// Se ejecuta antes de pintar: aplica el fondo, el modo y el acento guardados (evita parpadeos).
(function () {
  var raiz = document.documentElement;
  var identificador = 'estandar';
  var modo = null;
  var variables = null;
  try {
    var guardado = localStorage.getItem('horario:fondo');
    if (guardado && /^[a-z-]+$/.test(guardado)) identificador = guardado;
    modo = localStorage.getItem('horario:modo');
    variables = JSON.parse(localStorage.getItem('horario:acento-vars') || 'null');
  } catch (error) { /* sin almacenamiento: valores por defecto */ }

  var enlace = document.createElement('link');
  enlace.rel = 'stylesheet';
  enlace.id = 'enlace-fondo';
  enlace.href = 'css/fondos/' + identificador + '.css';
  document.head.appendChild(enlace);
  raiz.dataset.fondo = identificador; // los fondos con imagen lo usan como selector

  // Modo y acento solo aplican al fondo Estándar
  if (identificador !== 'estandar') return;

  var oscuro = !(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);
  if (modo === 'claro' || modo === 'oscuro') {
    raiz.dataset.tema = modo;
    oscuro = modo === 'oscuro';
  }

  // Acento ya calculado; solo se aceptan colores con formato #rrggbb
  var nombres = { acento: '--acento', sobre: '--texto-sobre-acento', textoOscuro: '--acento-texto-oscuro', textoClaro: '--acento-texto-claro' };
  if (variables && typeof variables === 'object') {
    var validas = true;
    for (var clave in nombres) {
      if (typeof variables[clave] !== 'string' || !/^#[0-9a-f]{6}$/.test(variables[clave])) validas = false;
    }
    if (validas) {
      for (var nombre in nombres) raiz.style.setProperty(nombres[nombre], variables[nombre]);
    }
  }

  // Color provisional de la barra del navegador (luego lo ajusta la app)
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', oscuro ? '#0e1014' : '#f4f5f8');
})();
