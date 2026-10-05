// Se ejecuta antes de pintar: carga el fondo guardado para evitar parpadeos.
(function () {
  var identificador = 'oscuro';
  try {
    var guardado = localStorage.getItem('horario:fondo');
    if (guardado && /^[a-z-]+$/.test(guardado)) identificador = guardado;
  } catch (error) { /* sin almacenamiento: se usa el fondo por defecto */ }

  var enlace = document.createElement('link');
  enlace.rel = 'stylesheet';
  enlace.id = 'enlace-fondo';
  enlace.href = 'css/fondos/' + identificador + '.css';
  document.head.appendChild(enlace);
})();
