# ⭐ Chico Estrella - La Aventura

Un juego de plataformas 2D creado íntegramente con HTML5 Canvas y JavaScript vanilla.  
Acompaña a Chico Estrella en su misión de proteger Buenos Aires de villanos únicos a lo largo de 6 niveles temáticos.

---

## Índice

1. [Cómo Jugar](#-cómo-jugar)
2. [Iniciar el Juego](#-iniciar-el-juego)
3. [Historia](#-historia)
4. [Niveles y Jefes](#-niveles-y-jefes)
5. [Personajes Jugables (Skins)](#-personajes-jugables-skins)
6. [Características del Juego](#-características-del-juego)
7. [Arquitectura Técnica](#-arquitectura-técnica)
8. [Especificación PWA](#-especificación-pwa)
9. [Estructura del Proyecto](#-estructura-del-proyecto)
10. [Tecnologías](#-tecnologías)
11. [Licencia](#-licencia)

---

## 🎮 Cómo Jugar

### Escritorio

| Acción | Teclas |
|--------|--------|
| Mover | `←` `→` o `A` `D` |
| Saltar | `↑` / `W` / `Espacio` |
| Ataque rayo | `Z` |
| Estrella ninja | `X` |
| Dash | `Shift izq.` |
| Pausar | `P` / `Escape` |
| Música on/off | `M` / `1` |
| SFX on/off | `S` / `2` |
| Reiniciar nivel | `R` |
| Confirmar | `Enter` |

### Móvil

En dispositivos táctiles se muestran controles en pantalla automáticamente.  
El juego requiere **orientación horizontal (landscape)**.

| Botón | ID HTML | Mapeo interno |
|-------|---------|---------------|
| ◀ Izquierda | `btn-left` | `ArrowLeft` |
| ▶ Derecha | `btn-right` | `ArrowRight` |
| ⬆ Salto | `btn-jump` | `Space` |
| 💨 Dash | `btn-dash` | `ShiftLeft` |
| ⚡ Rayo | `btn-z` | `KeyZ` |
| ★ Estrella | `btn-x` | `KeyX` |
| ❚❚ Pausa | `btn-pause` | `togglePause()` |
| ▲ Bonus arriba | `btn-bonus-up` | `ArrowUp` |
| ▼ Bonus abajo | `btn-bonus-down` | `ArrowDown` |

---

## 🚀 Iniciar el Juego

1. Abrí el archivo `index.html` en cualquier navegador moderno.
2. No necesita servidor, dependencias ni instalación.

---

## 📖 Historia

En el planeta Crux, una estrella gigante que se apagó, todos los habitantes perecieron... todos menos uno. Sus padres lo lanzaron al espacio con una resortera gigante. Viajó por el cosmos hasta llegar a la Tierra, a Tacna, en Perú. A los 16 años escapó a Argentina y se convirtió en el superhéroe conocido como **¡Chico Estrella!**

---

## 🌍 Niveles y Jefes

| # | Nombre | Jefe | Descripción del Jefe |
|---|--------|------|----------------------|
| 1 | Las Calles de Buenos Aires | Mocusón | Monstruo de mocos gigantes |
| 2 | El Basural Tóxico | Romecio | Remera violeta sucia gigante cobró vida |
| 3 | La Dimensión Espejo | El Cambia Formas | Chico Estrella de colores invertidos |
| 4 | La Habitación Oscura | El Monstruo debajo de la cama | Criatura de las sombras |
| 5 | La Heladería Maldita | Maelado | Villano helado |
| 6 | El Colegio del Ruido | Timbroso | Villano del sonido |

---

## 🧑‍🚀 Personajes Jugables (Skins)

| Skin | Precio | Función de dibujo |
|------|--------|-------------------|
| Chico Estrella | Gratis (default) | `drawChicoEstrella()` |
| Chica Fugaz | 100 monedas | `drawChicaFugaz()` |
| Chico Luminoso | 200 monedas | `drawChicoLuminoso()` |

Las skins se desbloquean en el **Mercado** del menú principal usando las monedas recolectadas.

---

## 🛠️ Características del Juego

- **6 niveles** con temáticas visuales y narrativas únicas.
- **Peleas contra jefes** al final de cada nivel.
- **Historia narrada** entre niveles con cinemáticas de texto.
- **Sistema de monedas** y tienda para desbloquear skins.
- **Tabla de récords (Top 10)** con persistencia local, ingreso de nombre al finalizar la partida.
- **Power-ups:** vuelo (float al mantener salto) y tamaño gigante.
- **Nivel bonus** de recolección de monedas.
- **Tutorial** integrado.
- **Combo system** con multiplicador.
- **Checkpoints** dentro de cada nivel.
- **5 vidas** por partida.
- **Camera shake** y screen flash como feedback visual.
- **Sistema de transiciones** con fade in/out entre pantallas.
- **Motor de audio procedural** (efectos y música generados con Web Audio API).
- **Progreso persistente** con `localStorage`.
- **Responsive:** soporte completo para escritorio y móvil.

---

## 🏗️ Arquitectura Técnica

### Archivo único

Todo el juego reside en `index.html` (~5800 líneas, ~213 KB) con HTML + CSS + JS inline.  
No hay dependencias externas de ningún tipo.

### Máquina de estados del juego

```
Variable: gameState (string)

Estados posibles:
┌─────────────────────────────────────────────────────────┐
│ title        → Menú principal (Jugar, Nivel de Prueba,  │
│                 Ajustes, Mercado)                        │
│ settings     → Pantalla de ajustes (música/SFX)         │
│ market       → Tienda de skins                          │
│ story        → Cinemática narrativa antes de cada nivel  │
│ tutorial     → Nivel tutorial                           │
│ playing      → Gameplay normal                          │
│ bossFight    → Pelea contra jefe                        │
│ bonus        → Nivel bonus de monedas                   │
│ levelComplete→ Pantalla de nivel completado             │
│ gameOver     → Pantalla de game over (con fases:        │
│                 enterName, showLeaderboard, done)        │
│ victory      → Victoria final (con fases:               │
│                 enterName, showLeaderboard, done)        │
│ paused       → Menú de pausa (con sub-estado de         │
│                 confirmación para reiniciar/salir)       │
└─────────────────────────────────────────────────────────┘
```

**Variables de soporte:**
- `previousState` — estado antes de pausar
- `pauseConfirm` — `null`, `'title'` o `'restart'` para confirmación destructiva

### Canvas y renderizado

| Propiedad | Valor |
|-----------|-------|
| Ancho base | 960 px |
| Alto base | 540 px |
| Aspect ratio | 16:9 |
| Renderizado | `image-rendering: pixelated` |
| Contexto | `canvas.getContext('2d')` |

**Escalado responsive:**
- **Desktop:** centra el canvas, mantiene aspect ratio, border dorado `#FFD700`.
- **Mobile:** `position: fixed`, sin borde, llena el viewport completo.
- Se recalcula en eventos `resize` y `orientationchange` vía `resizeCanvas()`.

### Game loop (timestep fijo)

```javascript
const FIXED_DT = 1000 / 60;   // ~16.67ms por tick lógico (60 FPS)

gameLoop(timestamp) {
  elapsed = timestamp - lastTime;  // clampeado a 200ms máx.
  while (accumulator >= FIXED_DT) {
    update();                      // lógica de juego
    accumulator -= FIXED_DT;
  }
  draw();                          // render
  requestAnimationFrame(gameLoop);
}
```

### Sistema de audio

Todo el audio es **procedural** usando Web Audio API (no hay archivos de audio).

| Componente | Detalle |
|------------|---------|
| Contexto | `AudioContext` / `webkitAudioContext`, lazy init |
| Inicialización | `ensureAudio()` en primer gesto de usuario |
| SFX | `playSound(freq, duration, type, volume)` con osciladores |
| Música | Secuenciador con `setInterval` de 200ms y look-ahead |
| Melodía | Oscilador `'square'`, 26 notas programadas |
| Bajo | Oscilador `'triangle'`, 16 notas |
| Flags | `musicEnabled`, `sfxEnabled`, `musicPlaying` |

**Efectos de sonido:**

| Función | Uso |
|---------|-----|
| `sfxJump()` | Salto (400→600 Hz) |
| `sfxHit()` | Daño recibido (200 Hz sawtooth) |
| `sfxCoin()` | Recoger moneda (800→1200 Hz) |
| `sfxBossHit()` | Golpear jefe (150 Hz sawtooth) |
| `sfxDeath()` | Muerte (300→200→100 Hz secuencia) |
| `sfxWin()` | Victoria (5 notas ascendentes) |
| `sfxAttack()` | Ataque rayo (300→500 Hz) |
| `sfxLaser()` | Láser (900→1100 Hz) |
| `sfxNinjaStar()` | Estrella ninja (600→800 Hz triangle) |

### Persistencia (localStorage)

| Clave | Tipo | Descripción |
|-------|------|-------------|
| `chicoEstrella_totalCoins` | `int` | Monedas totales acumuladas |
| `chicoEstrella_selectedSkin` | `int` (0-2) | Skin actualmente seleccionada |
| `chicoEstrella_unlockedSkins` | `JSON bool[]` | Skins desbloqueadas `[true, false, false]` |
| `chicoEstrella_leaderboard` | `JSON object[]` | Top 10 puntajes `[{name, score}, ...]` |

**Función de guardado:** `saveMarketData()`, `saveToLeaderboard()`

### Detección de dispositivo

```javascript
const isMobileEarly = ('ontouchstart' in window) ||
                      navigator.maxTouchPoints > 0 ||
                      window.matchMedia('(pointer: coarse)').matches;
```

Usado para:
- Mostrar/ocultar controles táctiles
- Saltar efectos costosos (gradientes radiales, afterimage del dash)
- Ajustar tamaño de botones táctiles
- Activar fullscreen automático

### Event listeners registrados

| Evento | Target | Propósito |
|--------|--------|-----------|
| `keydown` / `keyup` | `window` | Input teclado |
| `touchstart` / `touchend` / `touchcancel` | Botones táctiles | Controles mobile |
| `mousedown` / `mouseup` / `mouseleave` | Botones táctiles | Fallback mouse |
| `touchstart` | `canvas` | Interacción de menús mobile |
| `click` | `canvas` | Interacción de menús desktop |
| `resize` | `window` | Recalcular canvas + orientación |
| `orientationchange` | `window` | Detectar rotación (con delay) |
| `touchstart` / `click` | `document` | Trigger fullscreen (once) |

### Optimizaciones mobile

- Gradientes radiales desactivados en mobile.
- Efecto afterimage del dash desactivado en mobile.
- Botones táctiles escalan con viewport: `Math.max(52, Math.min(vh * 0.11, 72))`.
- Soporte de safe area insets: `env(safe-area-inset-top)`.
- Clampeo de elapsed time a 200ms para evitar "spiral of death" al cambiar de pestaña.

---

## 📱 Especificación PWA

### Resumen de viabilidad

El juego es **ideal para PWA** por diseño:

| Requisito | Estado |
|-----------|--------|
| Archivo único sin dependencias externas | ✅ Cumple |
| Sin assets externos (todo dibujado con Canvas) | ✅ Cumple |
| Funciona offline | ✅ Cumple (solo necesita cachear `index.html`) |
| Responsive y mobile-first | ✅ Cumple |
| Controles táctiles implementados | ✅ Cumple |
| Persistencia local | ✅ Cumple (localStorage) |

### Archivos a crear

#### 1. `manifest.json`

```jsonc
{
  "name": "Chico Estrella - La Aventura",
  "short_name": "Chico Estrella",
  "description": "Juego de plataformas 2D. ¡Protegé Buenos Aires de los villanos!",
  "start_url": "/index.html",
  "display": "fullscreen",
  "orientation": "landscape",
  "theme_color": "#1a0a2e",
  "background_color": "#000000",
  "lang": "es",
  "categories": ["games", "entertainment"],
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "screenshots/gameplay.png",
      "sizes": "960x540",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Gameplay"
    }
  ]
}
```

**Notas de implementación:**
- `display: "fullscreen"` es clave para juegos — oculta toda la UI del navegador.
- `orientation: "landscape"` fuerza horizontal, alineado con la detección ya existente.
- Separar `purpose: "any"` y `purpose: "maskable"` en dos entradas si el ícono no es maskable-safe.

#### 2. `sw.js` (Service Worker)

```javascript
const CACHE_NAME = 'chico-estrella-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install: cachear assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: limpiar caches viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== CACHE_NAME)
        .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first para assets
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request))
  );
});
```

**Estrategia de caché recomendada:** Network-first (busca la versión nueva, usa cache como fallback offline).  
**Actualización:** Se auto-actualiza al detectar nueva versión del Service Worker. Firebase sirve `sw.js` sin caché (`Cache-Control: no-cache, no-store, must-revalidate`).

#### 3. Cambios en `index.html`

Agregar dentro de `<head>`:

```html
<!-- PWA Manifest -->
<link rel="manifest" href="manifest.json">

<!-- iOS PWA support -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Chico Estrella">
<link rel="apple-touch-icon" href="icons/icon-192.png">

<!-- Theme color -->
<meta name="theme-color" content="#1a0a2e">
```

Agregar al final del `<script>`:

```javascript
// Registrar Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => console.log('SW registrado:', reg.scope))
    .catch(err => console.error('SW error:', err));
}
```

#### 4. Íconos necesarios

| Archivo | Tamaño | Uso |
|---------|--------|-----|
| `icons/icon-192.png` | 192×192 | Android, manifest |
| `icons/icon-512.png` | 512×512 | Splash screen, instalación |
| `icons/icon-180.png` | 180×180 | `apple-touch-icon` (iOS) |
| `icons/favicon.ico` | 32×32 | Pestaña del navegador |

> 💡 **Sugerencia:** Generar los íconos a partir de `Chico Estrella.png` con fondo `#1a0a2e`.

### Consideraciones adicionales para PWA

#### Modo standalone vs. fullscreen

El juego ya intenta `requestFullscreen()` en el primer toque. En modo PWA standalone/fullscreen, ese código puede fallar silenciosamente porque ya está en fullscreen. **No requiere cambios** — el `try/catch` existente lo maneja.

#### Actualización del juego

Implementar notificación al usuario cuando hay nueva versión:

```javascript
navigator.serviceWorker.register('sw.js').then(reg => {
  reg.addEventListener('updatefound', () => {
    const newWorker = reg.installing;
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'activated') {
        // Mostrar banner: "Nueva versión disponible. Recargá para actualizar."
      }
    });
  });
});
```

#### Persistencia de datos

`localStorage` funciona en PWAs igual que en el navegador. Para mayor robustez a futuro, considerar migrar a **IndexedDB** (permite almacenar más datos y es más resiliente), pero para los 3 valores actuales localStorage es suficiente.

#### Servidor local para desarrollo

Para que el Service Worker funcione, el juego debe servirse por HTTP(S), no por `file://`.

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .

# VS Code → extensión "Live Server"
```

#### Lighthouse checklist PWA

| Criterio | Acción |
|----------|--------|
| Manifest válido | Crear `manifest.json` |
| Service Worker | Crear `sw.js` |
| HTTPS | Requerido en producción |
| Responsive | ✅ Ya implementado |
| Splash screen | Definido por manifest (icons + colors) |
| Theme color | Agregar `<meta name="theme-color">` |
| Redirects HTTP → HTTPS | Configurar en hosting |
| Viewport meta | ✅ Ya presente |

---

## 📁 Estructura del Proyecto

### Actual

```
JuegoChicoEstrella/
├── index.html                          # Juego completo (HTML + CSS + JS, ~5800 líneas)
├── README.md                           # Este archivo
├── Chico Estrella.png                  # Arte del protagonista
├── Chica Fugaz.png                     # Arte de skin alternativa
├── Chico Luminoso.png                  # Arte de skin alternativa
├── Mocuson.png                         # Arte del jefe - Nivel 1
├── Romecio.png                         # Arte del jefe - Nivel 2
├── Cambia Forma.png                    # Arte del jefe - Nivel 3
├── Monstruo debajo de la cama.png      # Arte del jefe - Nivel 4
├── Maelado.png                         # Arte del jefe - Nivel 5
├── Timbroso.png                        # Arte del jefe - Nivel 6
└── Chico Estrella y este soy yo.png    # Arte adicional
```

### Propuesta post-PWA

```
JuegoChicoEstrella/
├── index.html                          # Juego (+ meta tags PWA + registro SW)
├── manifest.json                       # Web App Manifest
├── sw.js                               # Service Worker
├── README.md                           # Documentación
├── icons/
│   ├── icon-192.png                    # Ícono 192×192
│   ├── icon-512.png                    # Ícono 512×512
│   ├── icon-180.png                    # Apple touch icon
│   └── favicon.ico                     # Favicon
├── screenshots/
│   └── gameplay.png                    # Screenshot para manifest
├── Chico Estrella.png
├── Chica Fugaz.png
├── Chico Luminoso.png
├── Mocuson.png
├── Romecio.png
├── Cambia Forma.png
├── Monstruo debajo de la cama.png
├── Maelado.png
├── Timbroso.png
└── Chico Estrella y este soy yo.png
```

---

## 🧰 Tecnologías

- **HTML5 Canvas** — renderizado 2D completo
- **JavaScript vanilla ES6+** — sin frameworks ni librerías
- **Web Audio API** — audio procedural (música y SFX)
- **localStorage** — persistencia de datos del jugador
- **Fullscreen API** — inmersión completa
- **Screen Orientation API** — forzar landscape
- **Service Worker** — cache offline para PWA con auto-actualización
- **Web App Manifest** — instalabilidad PWA

---

## 📜 Licencia

Proyecto personal. Todos los derechos reservados.
