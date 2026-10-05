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
- Añadir, editar y borrar eventos.
- Cambiar el fondo de la aplicación.

---

## 2. Pantallas

La navegación es una barra inferior con tres pestañas: **Hoy**, **Semana** y **Ajustes**. El botón flotante **+** está disponible en todas ellas.

### 2.1 Hoy

- Arriba: la fecha completa y una fila de siete botones **L M X J V S D**. Al abrir queda marcado el día actual.
- Debajo: los eventos del día elegido, de la hora más temprana a la más tardía.
- Cada evento muestra su rango de horas, su título y, si la tiene, su nota.
- Si se está viendo el día de hoy y la hora actual cae dentro de un evento (inicio incluido, fin excluido), ese evento se resalta con la etiqueta **Ahora**. La marca se actualiza cada minuto mientras la app está visible.
- Si no hay eventos: mensaje "Nada este día. Pulsa + para añadir."
- Tocar un evento abre su edición.

### 2.2 Semana

- Lista vertical con un día por tarjeta, de lunes a domingo, con el mismo estilo visual que Hoy. En pantallas anchas las tarjetas se acomodan en cuadrícula de dos columnas.
- **Cabecera** de cada tarjeta: nombre del día y cantidad de eventos. El día actual lleva la etiqueta **Hoy** y un borde destacado.
- **Franja de ocupación**: bajo la cabecera, una barra horizontal que representa las 24 horas del día. Los tramos con eventos aparecen rellenos y los huecos vacíos, así se ve de un vistazo cuándo estás ocupado y cuándo libre. Los eventos que coinciden se superponen en el mismo tramo.
- **Eventos**: una fila por evento con hora de inicio y fin y título, ordenados por hora.
- Los días sin eventos muestran **Libre**.
- Tocar la cabecera de un día abre ese día en la pantalla Hoy. Tocar un evento abre su edición.

### 2.3 Ajustes

- **Fondo**: opción **Oscuro**. Cada fondo tiene su propio archivo CSS y se puede añadir otro sin tocar el resto de la app.
- La elección se recuerda al volver a abrir la aplicación.

---

## 3. Añadir y editar eventos

El botón **+** abre una hoja corta desde la parte inferior. Tocar un evento abre la misma hoja con sus datos.

| Campo | Comportamiento |
|---|---|
| **Título** | Texto libre (máx. 60 caracteres). Vacío → se guarda como "Sin título". **Intro** guarda el evento. |
| **Día** | Siete botones. Viene marcado el día que se está viendo. |
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

Un evento nuevo propone inicio **09:00** y fin **10:00**.

Al guardar desde la pantalla Hoy, se muestra el día en el que quedó el evento.

---

## 4. Reglas de las horas

1. Los minutos son siempre múltiplos de 5.
2. El fin debe ser posterior al inicio; la aplicación lo corrige sola:
   - Si al mover el **inicio** el fin queda igual o anterior, el fin pasa a ser **una hora después** del inicio.
   - Si al mover el **fin** queda igual o anterior al inicio, el fin pasa a ser **5 minutos después** del inicio.
3. Un evento no puede cruzar la medianoche: el fin máximo es **23:55**.
   - Si "inicio + 1 hora" supera 23:55, el fin se fija en 23:55.
   - Como el fin debe ser posterior al inicio, el inicio máximo es **23:50**.
4. Se permite que varios eventos coincidan en el mismo horario.

---

## 5. Datos

Cada evento es un objeto con:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | texto | Identificador único. |
| `titulo` | texto | Título del evento. |
| `dia` | número 0–6 | 0 = lunes … 6 = domingo. |
| `inicio` | número | Minutos desde las 00:00 (0–1430, múltiplo de 5). |
| `fin` | número | Minutos desde las 00:00 (5–1435, múltiplo de 5, mayor que `inicio`). |
| `nota` | texto | Opcional. |

Guardar las horas como minutos enteros simplifica ordenar, comparar y dibujar la franja de ocupación.

**Almacenamiento**: todo se guarda en `localStorage`, en dos claves: una para la lista de eventos (JSON) y otra para el fondo elegido. Al leer, se valida el contenido; si está dañado se parte de una lista vacía sin romper la app.

**Orden**: por `inicio`; en empate, por `fin`.

---

## 6. Fondos y colores

- Los colores se definen con variables CSS: `--fondo`, `--superficie`, `--superficie-2`, `--texto`, `--texto-suave`, `--borde`, `--acento`, `--texto-sobre-acento`, `--peligro`.
- `style.css` contiene solo la estructura y usa únicamente esas variables. Cada fondo (`css/fondos/oscuro.css`) solo define los valores.
- **Añadir un fondo**: crear `css/fondos/<id>.css` con las mismas variables, registrarlo en `js/fondos.js` y añadirlo a la lista de archivos de `sw.js`.
- El fondo activo se aplica con un atributo en `<html>` (`data-fondo`) y se carga antes de pintar, para evitar parpadeos.
- Cada fondo fija un color de acento y un `--texto-sobre-acento` con contraste mínimo 4.5:1 (en el fondo Oscuro supera 9:1), aplicado a botones principales, día seleccionado, pestaña activa y etiquetas.
- La etiqueta `theme-color` del navegador cambia con el fondo.

---

## 7. Diseño y accesibilidad

- **Gráficos**: icono de la app en `img/icono.svg`. El resto de iconos son SVG en línea que heredan el color del tema (`currentColor`).
- **Tipografía**: solo fuentes del sistema.
- **aria-label** en todos los SVG; botones y pestañas con nombre accesible; pestaña activa con `aria-current`.
- La hoja es un diálogo modal: foco dentro mientras está abierta, **Esc** la cierra y el foco vuelve al elemento que la abrió.
- Contraste suficiente en el fondo disponible (texto sobre fondo > 15:1).
- **Áreas seguras** (notch y barra inferior) con `env(safe-area-inset-*)`.
- Transiciones CSS breves que se desactivan con `prefers-reduced-motion`.
- Objetivos táctiles de al menos 44 px.

---

## 8. Rendimiento

- Sin librerías: JavaScript nativo en módulos pequeños.
- Solo se dibuja la pantalla visible; al guardar se redibuja únicamente esa pantalla.
- Un solo escuchador de eventos por lista (delegación), en vez de uno por elemento.
- Las ruedas usan desplazamiento nativo con ajuste (`scroll-snap`), sin cálculos pesados durante el gesto; el valor se lee una vez al detenerse.
- Animaciones solo con `transform` y `opacity`.
- Una sola escritura a `localStorage` por cambio.
- El temporizador de "Ahora" se pausa cuando la app queda en segundo plano.
- Toda la aplicación se precarga en el primer acceso, así se abre al instante.

---

## 9. Instalación y uso sin conexión

- `manifest.webmanifest`: nombre, iconos, modo `standalone`, orientación vertical.
- `sw.js` (service worker): guarda todos los archivos en caché la primera vez, los sirve desde ahí al instante y los actualiza en segundo plano cuando hay conexión.
- Requiere **HTTPS** (o `localhost`) para instalarse y funcionar sin conexión. Los módulos JavaScript no se cargan abriendo `index.html` directamente desde el disco: se necesita un servidor estático.
- **iPhone**: Safari → Compartir → "Añadir a pantalla de inicio".
- **Android**: Chrome → menú → "Instalar aplicación".
- Se incluyen iconos PNG (192 y 512 px, y uno para iOS) derivados de `img/icono.svg`, porque iOS no admite SVG como icono de pantalla de inicio.

---

## 10. Seguridad

- El texto del usuario se inserta siempre como texto (nunca como HTML), para evitar inyección de código.
- Límite de longitud en título y nota.
- Validación de todos los datos leídos del almacenamiento.
- Sin peticiones de red ni código de terceros.

---

## 11. Estructura del proyecto

```
horario/
├── index.html                 Estructura de la página y pantallas
├── manifest.webmanifest       Datos de instalación
├── sw.js                      Funcionamiento sin conexión
├── README.md
├── css/
│   ├── style.css              Estructura y componentes (solo variables de color)
│   └── fondos/
│       └── oscuro.css         Valores del fondo oscuro
├── js/
│   ├── fondo-inicial.js       Carga el fondo guardado antes de pintar
│   ├── app.js                 Arranque, estado y navegación entre pantallas
│   ├── nucleo.js              Reglas de horas, orden, validación (sin DOM)
│   ├── tiempo.js              Días, conversión minutos <-> "HH:MM", fecha de hoy
│   ├── almacenamiento.js      Leer, validar y guardar en localStorage
│   ├── fondos.js              Lista de fondos y cómo se aplican
│   ├── vista-hoy.js           Pantalla Hoy
│   ├── vista-semana.js        Pantalla Semana y franja de ocupación
│   ├── vista-ajustes.js       Pantalla Ajustes
│   ├── hoja.js                Hoja de añadir/editar
│   ├── rueda.js               Selector de rueda y selector de hora
│   ├── dias.js                Fila de botones L M X J V S D
│   ├── iconos.js              SVG en línea con aria-label
│   └── dom.js                 Creación segura de elementos
└── img/
    ├── icono.svg
    ├── icono-192.png
    ├── icono-512.png
    └── icono-apple.png
```

**Separación de responsabilidades**: `nucleo.js` y `tiempo.js` contienen la lógica sin tocar el DOM; las vistas solo dibujan; `almacenamiento.js` es lo único que habla con `localStorage`.

---

## 12. Flujo de una acción (ejemplo: guardar un evento)

1. El usuario pulsa **Guardar** en la hoja.
2. `hoja.js` reúne título, día, inicio, fin y nota.
3. `nucleo.js` normaliza: título vacío → "Sin título", comprueba que el fin sea posterior al inicio y que respete los límites.
4. `almacenamiento.js` guarda la lista actualizada.
5. La hoja se cierra y se redibuja solo la pantalla visible.
