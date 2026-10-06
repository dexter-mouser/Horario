# Horario

Aplicación web para consultar y modificar tu horario semanal desde el celular. Sustituye la costumbre de guardar el horario como una foto: se abre al instante, se ve de un vistazo y se cambia en pocos toques.

- Funciona en iPhone y Android.
- Se instala desde el navegador (PWA) y trabaja sin conexión.
- Sin servidores, cuentas, notificaciones ni librerías externas.
- Tipografía del sistema; todos los datos se guardan en el propio dispositivo.

---

## 1. Qué permite hacer

- Ver los eventos del día elegido, ordenados por hora.
- Ver toda la semana de un vistazo: una tarjeta por día, con horas ocupadas y huecos.
- Ver y preparar la semana próxima.
- Añadir, editar y borrar eventos, indicando si se repiten cada semana o valen una sola vez.
- Guardar turnos predefinidos y planificar una semana completa con ellos.
- Recibir un aviso cuando un evento llega hasta el final del día.
- Cambiar el fondo de la aplicación.

---

## 2. Pantallas

La navegación es una barra inferior con cuatro pestañas: **Hoy**, **Semana**, **Próxima** y **Ajustes**. El botón flotante **+** está disponible en todas ellas.

### 2.1 Hoy

- Arriba: la fecha completa y una fila de siete botones **L M X J V S D**. Al abrir queda marcado el día actual.
- Debajo: los eventos del día elegido, de la hora más temprana a la más tardía.
- Cada evento muestra su rango de horas, su título y, si la tiene, su nota. Los eventos de una sola vez llevan la etiqueta **Una vez**.
- Si se está viendo el día de hoy y la hora actual cae dentro de un evento (inicio incluido, fin excluido), ese evento se resalta con la etiqueta **Ahora**. La marca se actualiza cada minuto mientras la app está visible.
- Si no hay eventos: mensaje "Nada este día. Pulsa + para añadir."
- Tocar un evento abre su edición.

### 2.2 Semana

- Muestra la semana actual con su rango de fechas. Una tarjeta por día, de lunes a domingo, con el mismo estilo visual que Hoy. En pantallas anchas las tarjetas se acomodan en cuadrícula de dos columnas.
- **Cabecera** de cada tarjeta: nombre del día y cantidad de eventos. El día actual lleva la etiqueta **Hoy** y un borde destacado.
- **Franja de ocupación**: una barra horizontal que representa las 24 horas del día. Los tramos con eventos aparecen rellenos y los huecos vacíos, así se ve cuándo estás ocupado y cuándo libre. Los eventos que coinciden se superponen en el mismo tramo.
- **Eventos**: una fila por evento con hora de inicio y fin y título, ordenados por hora.
- Los días sin eventos muestran **Libre**.
- Tocar la cabecera de un día abre ese día en la pantalla Hoy. Tocar un evento abre su edición.
- El botón **Planificar** abre la planificación de esta semana (ver 7).

### 2.3 Semana próxima

- Misma vista que Semana, para la semana siguiente, con su rango de fechas. Muestra los eventos indefinidos y los de una sola vez que hayas creado para esa semana.
- El botón **+** en esta pestaña crea eventos para la semana próxima. Tocar un evento abre su edición. Las cabeceras de los días son solo informativas.
- El botón **Planificar** abre la planificación de la semana próxima (ver 7).
- **Cambio de semana**: cada lunes a las 00:00 la semana próxima pasa a ser la actual (con todo lo que tenía) y la nueva semana próxima muestra solo los eventos indefinidos.

### 2.4 Ajustes

- **Fondo**: opciones **Oscuro** (liso) y **Aurora** (aurora boreal sobre montañas y lago)**Vaquero**(paisaje del viejo oeste). Cada fondo tiene su propio archivo CSS y se puede añadir otro sin tocar el resto de la app.
- **Turnos**: lista de turnos guardados (nombre y horario). Tocar uno lo edita; **+ Añadir turno** crea uno nuevo (hasta 12). Ver 7.
- Las elecciones se recuerdan al volver a abrir la aplicación.

---

## 3. Añadir y editar eventos

El botón **+** abre una hoja corta desde la parte inferior. Tocar un evento abre la misma hoja con sus datos.

| Campo | Comportamiento |
|---|---|
| **Título** | Texto libre (máx. 60 caracteres). Vacío → se guarda como "Sin título". **Intro** guarda el evento. |
| **Día** | Siete botones. Viene marcado el día que se está viendo. |
| **Repetición** | **Indefinido** (por defecto) o **Por una vez**. Ver 4. |
| **Turnos** | Si hay turnos guardados aparecen como botones; tocar uno rellena inicio y fin y, si el título está vacío, el nombre del turno. |
| **Inicio / Fin** | Dos selectores de rueda, uno junto al otro y con el mismo diseño. Un recuadro **I** a la izquierda y otro **F** a la derecha indican a qué hora corresponde cada rueda. |
| **Nota** | Opcional (máx. 500 caracteres). El enlace **+ Nota** despliega un campo de texto libre. |

**Ruedas de hora**

- Cada selector tiene una rueda de horas (00 a 23) y una de minutos (00, 05, 10 … 55).
- Se desliza hasta el valor y la rueda se detiene siempre sobre una opción (ajuste por posiciones).
- Se ve la opción elegida en el centro y la anterior y la siguiente atenuadas.

**Botones de la hoja**

- **Guardar**: crea o actualiza el evento.
- **Cancelar** o tocar fuera de la hoja: cierra sin guardar.
- **Borrar**: solo aparece al editar un evento existente.

Un evento nuevo propone inicio **09:00** y fin **10:00**. Al guardar desde la pantalla Hoy, se muestra el día en el que quedó el evento.

---

## 4. Indefinido y Por una vez

- **Indefinido**: el evento se repite todas las semanas en su día y hora.
- **Por una vez**: el evento vale solo para una semana. Se asigna a la semana de la pantalla desde la que se crea (actual o próxima) y **se pierde al terminar esa semana** (el lunes a las 00:00).
- Al editar se puede cambiar de tipo en cualquier momento.
- Un evento de una sola vez solo puede pertenecer a la semana actual o a la próxima.

---

## 5. Reglas de las horas

1. Los minutos son siempre múltiplos de 5.
2. El fin debe ser posterior al inicio; la aplicación lo corrige sola:
   - Si al mover el **inicio** el fin queda igual o anterior, el fin pasa a ser **una hora después** del inicio.
   - Si al mover el **fin** queda igual o anterior al inicio, el fin pasa a ser **5 minutos después** del inicio.
3. Un evento no puede cruzar la medianoche: el día termina a las **23:55** (fin máximo).
   - Si "inicio + 1 hora" supera 23:55, el fin se fija en 23:55.
   - Como el fin debe ser posterior al inicio, el inicio máximo es **23:50**.
4. Se permite que varios eventos coincidan en el mismo horario.

### Aviso de fin de día

Cuando un evento llega hasta las **23:55** aparece un aviso emergente dentro de la app (no usa notificaciones del sistema): "Este horario llega hasta las 23:55. Si continúa pasada la medianoche, crea un evento para el día siguiente."

- Aparece al guardar un evento nuevo o cuando su fin pasa a ser 23:55.
- **Entendido** cierra el aviso. **Crear ahora** abre la hoja con el día siguiente, de 00:00 a 01:00, con el mismo título y la misma repetición.
- Si el evento es del domingo, el día siguiente es el lunes de la semana siguiente. Si el evento es de una sola vez de la semana próxima, no se ofrece **Crear ahora** (no se admiten eventos de una vez más allá de la semana próxima) y el aviso solo informa.

---

## 6. Datos

Cada evento es un objeto con:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | texto | Identificador único. |
| `titulo` | texto | Título del evento. |
| `dia` | número 0–6 | 0 = lunes … 6 = domingo. |
| `inicio` | número | Minutos desde las 00:00 (0–1430, múltiplo de 5). |
| `fin` | número | Minutos desde las 00:00 (5–1435, múltiplo de 5, mayor que `inicio`). |
| `nota` | texto | Opcional. |
| `repeticion` | texto | `indefinido` o `una-vez`. Si falta, se trata como `indefinido`. |
| `semana` | texto | Solo en `una-vez`: lunes de su semana, `AAAA-MM-DD`. |
| `origen` | texto | `plan` si lo creó una planificación; los manuales no lo llevan. |

Cada turno tiene `id`, `nombre` (máx. 30 caracteres), `inicio` y `fin` con las mismas reglas de horas.

**Almacenamiento**: todo se guarda en `localStorage` en tres claves: eventos, turnos y fondo. Al leer, se valida cada elemento y se descarta lo dañado sin romper la app.

**Semanas**: cada semana se identifica por su lunes. Las vistas calculan la semana actual con la fecha del dispositivo, así el cambio del lunes no mueve datos: solo se borran los eventos de una vez de semanas ya terminadas (al abrir la app, al volver a ella y al pasar la medianoche del domingo).

**Orden**: por `inicio`; en empate, por `fin`.

---

## 7. Turnos y planificación

**Turnos**: horarios con nombre que usas con frecuencia (por ejemplo "Mañana 06:00–14:00", "Tarde 14:00–22:00"). Se crean, editan y borran en Ajustes. Borrar un turno no toca los eventos ya creados con él.

**Uso rápido**: en la hoja de evento, tocar un turno rellena las horas.

**Planificar semana**: el botón **Planificar** de Semana y de Próxima abre una hoja con los siete días. Cada día tiene un selector con **Libre** o uno de tus turnos (uno por día).

- Se elige si el plan es **Indefinido** o **Por una vez**. Un plan por una vez se aplica a la semana de la pantalla desde la que se abrió.
- Al aplicar se crea un evento por cada día con turno, con el nombre del turno como título.
- Un plan nuevo **reemplaza solo los eventos creados por planes anteriores del mismo tipo** (y de la misma semana, si es de una vez). Los eventos creados a mano nunca se tocan.
- Si se edita a mano un evento creado por un plan, pasa a contar como manual.
- Si algún turno termina a las 23:55, se muestra un único aviso con la lista de esos días.
- Un turno que cruza la medianoche (por ejemplo de 17:00 a 01:00) se maneja como dos turnos: uno hasta 23:55 y otro desde 00:00 el día siguiente.

---

## 8. Fondos y colores

- Los colores se definen con variables CSS: `--fondo`, `--superficie`, `--superficie-2`, `--texto`, `--texto-suave`, `--borde`, `--acento`, `--texto-sobre-acento`, `--peligro`.
- `style.css` contiene solo la estructura y usa únicamente esas variables. Cada fondo (`css/fondos/oscuro.css`) solo define los valores.
- **Añadir un fondo**: crear `css/fondos/<id>.css` con las mismas variables, registrarlo en `js/fondos.js` y añadirlo a la lista de archivos de `sw.js`.
- El fondo activo se carga antes de pintar, para evitar parpadeos.
- Un fondo con imagen la declara en su propio CSS con el selector `html[data-fondo="<id>"] body`, estática (sin animaciones ni `background-attachment: fixed`) y como imagen incrustada (`data:`), porque la app no carga recursos externos. Las tarjetas, la barra inferior y las hojas tienen fondo sólido, así que el texto siempre se lee sobre color liso.
- Cada fondo fija un color de acento y un `--texto-sobre-acento` con contraste mínimo 4.5:1 (en el fondo Oscuro supera 9:1), aplicado a botones principales, día seleccionado, pestaña activa y etiquetas.
- La etiqueta `theme-color` del navegador cambia con el fondo.

---

## 9. Diseño y accesibilidad

- **Gráficos**: icono de la app en `img/icono.svg`. El resto de iconos son SVG en línea que heredan el color del tema (`currentColor`).
- **Tipografía**: solo fuentes del sistema.
- **aria-label** en todos los SVG; botones y pestañas con nombre accesible; pestaña activa con `aria-current`.
- La hoja de evento, la de turno, la de planificación y el aviso son diálogos modales: foco dentro mientras están abiertos, **Esc** los cierra y el foco vuelve al elemento que los abrió. El aviso es un diálogo de alerta.
- Contraste suficiente en el fondo disponible (texto sobre fondo > 15:1).
- **Áreas seguras** (notch y barra inferior) con `env(safe-area-inset-*)`.
- Transiciones CSS breves que se desactivan con `prefers-reduced-motion`.
- Objetivos táctiles de al menos 44 px.

---

## 10. Rendimiento

- Sin librerías: JavaScript nativo en módulos pequeños.
- Solo se dibuja la pantalla visible; al guardar se redibuja únicamente esa pantalla.
- Un solo escuchador de eventos por lista (delegación), en vez de uno por elemento.
- Las ruedas usan desplazamiento nativo con ajuste (`scroll-snap`), sin cálculos pesados durante el gesto; el valor se lee una vez al detenerse.
- Animaciones solo con `transform` y `opacity`.
- Una sola escritura a `localStorage` por cambio.
- El temporizador del minuto se pausa cuando la app queda en segundo plano y solo redibuja Hoy (o cualquier pantalla si cambia la semana).
- Toda la aplicación se precarga en el primer acceso, así se abre al instante.

---

## 11. Instalación y uso sin conexión

- `manifest.webmanifest`: nombre, iconos, modo `standalone`, orientación vertical.
- `sw.js` (service worker): guarda todos los archivos en caché la primera vez, los sirve desde ahí al instante y los actualiza en segundo plano cuando hay conexión.
- Requiere **HTTPS** (o `localhost`) para instalarse y funcionar sin conexión. Los módulos JavaScript no se cargan abriendo `index.html` directamente desde el disco: se necesita un servidor estático.
- **iPhone**: Safari → Compartir → "Añadir a pantalla de inicio".
- **Android**: Chrome → menú → "Instalar aplicación".
- Se incluyen iconos PNG (192 y 512 px, y uno para iOS) derivados de `img/icono.svg`, porque iOS no admite SVG como icono de pantalla de inicio.

---

## 12. Seguridad

- El texto del usuario se inserta siempre como texto (nunca como HTML), para evitar inyección de código.
- Límite de longitud en título, nota y nombre de turno.
- Validación de todos los datos leídos del almacenamiento.
- Política de seguridad de contenido: solo recursos propios.
- Sin peticiones de red ni código de terceros.

---

## 13. Estructura del proyecto

```
horario/
├── index.html                 Estructura de la página, pantallas y ventanas
├── manifest.webmanifest       Datos de instalación
├── sw.js                      Funcionamiento sin conexión
├── README.md
├── css/
│   ├── style.css              Estructura y componentes (solo variables de color)
│   └── fondos/
│       └── oscuro.css         Valores del fondo oscuro
├── js/
│   ├── fondo-inicial.js       Carga el fondo guardado antes de pintar
│   ├── app.js                 Arranque, estado, semanas y navegación
│   ├── nucleo.js              Reglas de horas, repetición, semanas y avisos (sin DOM)
│   ├── turnos.js              Turnos y aplicación de planes (sin DOM)
│   ├── tiempo.js              Días, semanas, conversión minutos <-> "HH:MM"
│   ├── almacenamiento.js      Leer, validar y guardar en localStorage
│   ├── fondos.js              Lista de fondos y cómo se aplican
│   ├── vista-hoy.js           Pantalla Hoy
│   ├── vista-semana.js        Pantallas Semana y Próxima, franja de ocupación
│   ├── vista-ajustes.js       Pantalla Ajustes (fondo y turnos)
│   ├── vista-plan.js          Hoja de planificación semanal
│   ├── hoja.js                Hoja de añadir/editar evento
│   ├── hoja-turno.js          Hoja de crear/editar turno
│   ├── alerta.js              Aviso emergente
│   ├── dialogo.js             Comportamiento común de las ventanas (foco, Esc)
│   ├── horas.js               Par de selectores Inicio/Fin con sus reglas
│   ├── rueda.js               Selector de rueda y selector de hora
│   ├── segmentado.js          Botones excluyentes (Indefinido | Por una vez)
│   ├── dias.js                Fila de botones L M X J V S D
│   ├── iconos.js              SVG en línea con aria-label
│   └── dom.js                 Creación segura de elementos
└── img/
    ├── icono.svg
    ├── icono-192.png
    ├── icono-512.png
    └── icono-apple.png
```

**Separación de responsabilidades**: `nucleo.js`, `turnos.js` y `tiempo.js` contienen la lógica sin tocar el DOM; las vistas y las hojas solo dibujan y recogen datos; `almacenamiento.js` es lo único que habla con `localStorage`.

---

## 14. Flujo de una acción (ejemplo: guardar un evento)

1. El usuario pulsa **Guardar** en la hoja.
2. `hoja.js` reúne título, día, repetición, horas y nota.
3. `nucleo.js` normaliza: título vacío → "Sin título", comprueba que el fin sea posterior al inicio y que respete los límites, y asigna la semana si es de una sola vez.
4. `almacenamiento.js` guarda la lista actualizada.
5. La hoja se cierra y se redibuja solo la pantalla visible.
6. Si el evento llega hasta las 23:55, aparece el aviso de fin de día.
