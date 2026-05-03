# ✝️ Jesús Salva a la Humanidad

**Juego de plataformas PWA** — Jesús recorre las calles de Nazaret y las profundidades del Infierno lanzando agua bendita para liberar almas poseídas y derrotar al Diablo.

🌐 **Demo en vivo:** https://jesus-salva-la-humanidad.web.app  
📦 **Repositorio:** https://github.com/djbrait/JesusSalvaLaHumanidad

---

## 🎮 Descripción funcional

### Historia
En el año 0001, las fuerzas del mal han corrompido los corazones de la humanidad. Personas inocentes caminan poseídas por espíritus del Infierno. Jesús desciende con su vaso sagrado de agua bendita para purificar cada alma perdida. El camino lo lleva desde las calles de Nazaret hasta las profundidades del Infierno, donde deberá enfrentarse al mismísimo Diablo.

### Objetivo
- Recorrer el único nivel de izquierda a derecha
- Lanzar agua bendita a los **17 poseídos** para convertirlos en personas buenas
- Llegar a la zona del Infierno y derrotar al **Diablo** (jefe final)
- Cuando el Diablo recibe suficiente agua bendita, se **transforma en Ángel** 🕊️

---

## 🕹️ Controles

| Teclado | Acción |
|---------|--------|
| ← → | Mover a Jesús |
| `Espacio` | Saltar (doble salto disponible) |
| `Shift` | Dash (empuje rápido) |
| `Z` | Lanzar agua bendita |
| `X` | Activar escudo de fe (cuesta 30 de fe) |
| `P` | Pausa |
| `Enter` | Confirmar en menús |
| `↑ ↓` | Navegar menús |

### Controles táctiles (móvil)
9 botones superpuestos al canvas:
- `←` `→` moverse
- `↑` saltar
- `≫` dash
- `Z` agua bendita
- `X` escudo
- `⏸` pausa

---

## ⚔️ Mecánicas de juego

### Jesús (protagonista)
- **Vida:** 5 corazones, 5 vidas totales
- **Doble salto:** se puede saltar en el aire una segunda vez
- **Dash:** impulso rápido horizontal (recarga: 35 frames)
- **Agua bendita (Z):** proyectil que convierte poseídos y daña al Diablo
- **Escudo de fe (X):** invencibilidad por 45 frames, cuesta 30 puntos de fe
- **Barra de fe:** se llena al convertir poseídos (+22 por cada uno, máximo 100)
- **Combo:** convertir múltiples poseídos en cadena multiplica los puntos

### Enemigos — Poseídos
- 17 enemigos distribuidos a lo largo del nivel
- Patrullan un rango de 115px de su posición inicial
- **1 golpe de agua bendita** los convierte: dejan de atacar, aparece halo dorado
- Si tocan a Jesús sin estar convertidos, le quitan 1 corazón
- Los poseídos en la zona del Infierno tienen aspecto más oscuro

### Jefe Final — El Diablo
| Fase | HP | Comportamiento | Firebolas |
|------|----|----------------|-----------|
| 1 — Cazador | 30 → 21 | Camina en el suelo | 1 cada 90 frames |
| 2 — Volador | 20 → 11 | Vuela, sinusoidal | 2 cada 60 frames |
| 3 — Furia | 10 → 0 | Vuela más rápido | 3 cada 40 frames |

- Al llegar a HP=0: se desencadena la transformación a **Ángel** (3200ms de animación)
- Las firebolas del Diablo quitan 1 corazón al tocar a Jesús

### Sistema de puntos
- Poseído convertido: 100 pts base × multiplicador de combo
- Monedas recogidas: 10 pts cada una
- Al perder una vida: penalización de combo

---

## 🗺️ Estructura del nivel

| Zona | X desde | Descripción |
|------|---------|-------------|
| Nazaret | 0 | Calles de piedra, palmeras, edificios beige |
| Transición | 3,200 | Gradual de Nazaret a Infierno |
| Infierno | 3,600+ | Rojo, lava, estalactitas, plataformas de obsidiana |
| Zona Jefe | 4,500+ | Arena de batalla con el Diablo |
| Final | 5,200 | Límite del nivel |

**Huecos en el suelo** (gaps): `1080–1220`, `2180–2340`, `3060–3200`, `4080–4180`

**Plataformas flotantes:** 17 plataformas estáticas de piedra a distintas alturas  
**Plataformas móviles:** 5 — algunas verticales, otras horizontales  
**Punto de control:** 1 cruz de madera a mitad del nivel (x ≈ 2340)  
**Recogibles:** 3 panes de vida (x: 680, 2620, 4050), cruces de oro como monedas

---

## 🎨 Escenario y personajes (Canvas 2D)

Todos los gráficos son **dibujados proceduralmente** con Canvas API. No hay imágenes externas.

### Jesús
- Túnica blanca, faja azul, cabello castaño largo, barba, **halo dorado animado**
- Al atacar: brazo extendido con rotación
- Con escudo: aura dorada pulsante alrededor del cuerpo
- Con fe alta (>50): resplandor dorado sutil

### Poseídos
- Aspecto oscuro, ojos rojos brillantes, temblor constante
- Al convertirse: ropa clara, halo dorado, símbolo ✓, aura de luz
- Género aleatorio (masculino/femenino) con ropa diferente

### El Diablo
- Cuerpo rojo, alas de murciélago que baten, cuernos amarillos, cola con flecha
- Ojos amarillos brillantes, boca con colmillos, tridente dorado
- Fase 2+: aura de fuego alrededor
- Fase 3: aura naranja intensa

### El Ángel (transformación final)
- Alas blancas plumosas grandes, túnica blanca, **halo dorado grande**
- Resplandor celestial animado

### Fondo — Nazaret
- Cielo celeste con gradiente cálido
- Sol brillante con corona luminosa
- Colinas de arena con parallax lento
- Edificios de piedra beige/terracota con arcos y ventanas
- Palmeras datileras animadas por el viento (con frutos)

### Fondo — Infierno
- Cielo rojo/negro, resplandor de lava
- Estalactitas desde el techo, estalagmitas del suelo (ambas animadas)
- Charcos de lava pulsantes en el suelo

---

## 🖥️ Pantallas

| Pantalla | Descripción |
|----------|-------------|
| **Título** | Jesús animado, 3 opciones (JUGAR / HISTORIA / AJUSTES) |
| **Historia** | Texto de lore en pergamino, vuelve al título |
| **Ajustes** | Toggle música/sonidos con flechas + Enter |
| **Jugando** | HUD con corazones, vidas, barra de fe, puntos, combo |
| **Jefe** | HUD extra con barra de HP del Diablo y fase actual |
| **Pausa** | Overlay semitransparente, 3 opciones |
| **Game Over** | Pantalla oscura roja, puntuación final |
| **Victoria** | Cielo dorado, Ángel y Jesús, puntuación final |

---

## 🔊 Audio

Todo el audio es **100% procedural** mediante Web Audio API. No hay archivos `.mp3` ni `.ogg`.

| Sonido | Descripción técnica |
|--------|---------------------|
| Salto | Oscilador sine, sweep frecuencia 200→600 Hz |
| Agua bendita | Sine + noise burst, 440 Hz |
| Conversión poseído | Acorde mayor ascendente (C-E-G) |
| Dash | Oscilador sawtooth, glide rápido |
| Herida recibida | Noise burst descendente |
| Golpe al Diablo | Impulso bajo + distorsión |
| Música Nazaret | Melodía pentatónica en modo mayor, sine suave |
| Música Infierno | Melodía menor con oscilador sawtooth, tempo más agresivo |

La música cambia automáticamente al entrar a la zona del Infierno (x ≥ 3600).

---

## 📱 PWA

- **Instalable** en Android/iOS desde el navegador
- **Offline:** `sw.js` cachea todos los assets (estrategia network-first)
- **Orientación forzada:** landscape; overlay de rotación si el dispositivo está vertical
- **Fullscreen:** declarado en `manifest.json`
- Iconos: 192px y 512px (normales y maskable)

---

## 🏗️ Arquitectura

### Estructura de archivos

```
JesusSalvaLaHumanidad/
├── index.html          # Juego completo (~1,370 líneas, JS inline)
├── sw.js               # Service Worker (cache: jesus-salva-v1)
├── manifest.json       # PWA manifest
├── firebase.json       # Hosting config + emulador puerto 5001
├── .firebaserc         # Proyecto: jesus-salva-la-humanidad
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-192-maskable.png
│   └── icon-512-maskable.png
└── README.md
```

### Tecnologías

| Tecnología | Uso |
|------------|-----|
| HTML5 Canvas 2D | Renderizado de todos los gráficos |
| Web Audio API | Síntesis de todos los sonidos |
| Vanilla JavaScript ES5 | Lógica del juego (sin frameworks) |
| Service Worker | Cache offline |
| Firebase Hosting | Despliegue en producción |
| GitHub | Control de versiones |

### Estructura del código (`index.html`)

El script está organizado en estas secciones lógicas, **en orden**:

```
1. AUDIO ENGINE
   - sfxJump(), sfxDash(), sfxConvert(), sfxHit(), sfxBossHit(), etc.
   - startMusic(hell), stopMusic()
   - ensureAudio() — desbloquea AudioContext en iOS

2. CONSTANTS
   - TILE=40, GRAV=0.55, JUMP=-13, MSPD=4.5, DSPD=10, DDUR=10, WSPD=9
   - LEVEL_W=5200, BOSS_X=4500, HELL_X=3600

3. STATE VARIABLES
   - gameState: 'title' | 'story' | 'settings' | 'playing' |
                'bossFight' | 'paused' | 'gameOver' | 'victory'
   - player, boss, level, camera (objetos planos JS)
   - playerProj[], bossProj[], particles[], enemies[]
   - score, lives, combo, faith

4. INPUT HANDLING
   - Teclado: keys{} via keydown/keyup
   - Táctil: touchKeys{} via setupTouch()
   - isDown(code) — unifica teclado y táctil

5. PARTICLES
   - spawnPart(x, y, color, count, size)
   - spawnHoly(x, y) — partículas de agua bendita

6. LEVEL GENERATION
   - makeLevel() → { platforms, enemies, coins, health, checkpoints }
   - makePlayer(startX) → objeto jugador
   - makeBoss() → objeto jefe

7. TRANSITIONS
   - fadeOut(callback), fadeIn()

8. GAME START
   - startLevel(), startBoss(), resetGame(keepScore)

9. PHYSICS
   - rectHit(a, b)
   - updMovPlats() — actualiza plataformas móviles
   - resolvePlat() — resolución de colisiones jugador-plataformas

10. UPDATE LOGIC
    - updPlayer()     — movimiento, salto, dash, ataque, escudo
    - updEnemies()    — patrulla, física, conversión
    - updProj()       — proyectiles jugador y jefe, colisiones
    - updBoss()       — IA del Diablo (3 fases)
    - updCamera()     — seguimiento suavizado
    - updTitle(), updStory(), updSettings(), updPause()
    - update()        — dispatcher principal

11. DRAW FUNCTIONS
    - drawBg()        — fondo completo con parallax
    - drawNazarethBg() — Nazaret: edificios, palmeras, dunas, sol
    - drawPalmBg()    — palma individual animada
    - drawHellBg()    — Infierno: lava, estalactitas
    - drawPlatforms() — suelo y plataformas
    - drawCoins(), drawHealth(), drawCheckpoints()
    - drawJesus(x,y,facing,anim,attackT,invinc,shieldT,faith,onGround)
    - drawPossessed(e), drawPersonBody(...)
    - drawDevilBody(x,y,t,phase), drawAngelBody(x,y,t)
    - drawDevil(boss)
    - drawWater(), drawFireballs(), drawParticles()
    - drawHUD(), drawBossHUD()
    - drawTitle(), drawStory(), drawGameOver()
    - drawVictory(), drawPause(), drawSettings()
    - draw()          — dispatcher principal

12. GAME LOOP
    - gameLoop(timestamp) via requestAnimationFrame
    - Actualiza fc (frame counter) cada frame
    - Llama update() y draw() cada frame

13. CANVAS RESIZE
    - resizeCanvas() — escala canvas CSS al viewport
    - checkOrientation() — muestra overlay en portrait

14. BOOT
    - Registro de Service Worker
    - requestAnimationFrame(gameLoop) inicial
```

### Objetos principales del juego

#### `player`
```js
{
  x, y, vx, vy,           // posición y velocidad
  w: 28, h: 50,           // tamaño hitbox
  hp, maxHp,              // corazones (5/5)
  lives,                  // vidas totales (5)
  invincible,             // frames de invencibilidad
  attackTimer, attackCD,  // cooldown agua bendita (22f)
  dashTimer, dashCD,      // duración y cooldown dash
  shieldTimer, shieldCD,  // duración y cooldown escudo
  faith, maxFaith,        // barra de fe (0-100)
  facing,                 // dirección (-1 izq, 1 der)
  onGround,               // está en suelo
  jumpsLeft, maxJumps,    // saltos restantes (2)
  animTimer, haloT,       // contadores de animación
  dead                    // bool
}
```

#### `boss`
```js
{
  name: 'EL DIABLO',
  x, y, vx, vy, w: 80, h: 120,
  hp: 30, maxHp: 30,
  phase: 1 | 2 | 3,      // cambia al 66% y 33% de HP
  attackTimer, attackCD,  // cadencia de firebolas por fase
  invincible,             // frames de invencibilidad post-golpe
  facing, flyT,           // dirección y timer de vuelo sinusoidal
  defeated,               // bool — HP llegó a 0
  transforming,           // bool — animación de transformación
  transformT,             // timer de transformación (0→180f)
  active, alive           // flags de estado
}
```

#### `level`
```js
{
  platforms: [...],       // { x, y, w, h, type, hell, move? }
  enemies: [...],         // { x, y, vx, vy, w, h, alive, converted, ... }
  coins: [...],           // { x, y, collected, anim }
  health: [...],          // { x, y, collected, anim }
  checkpoints: [...],     // { x, y, active, anim }
  width: 5200,
  bossZone: 4500
}
```

#### `camera`
```js
{ x, y }  // desplazamiento del mundo. El viewport muestra [camera.x, camera.x+960]
```

### Ciclo de estados del juego

```
title
  ├─[JUGAR]──────────────────→ playing
  ├─[HISTORIA]───────────────→ story ──[Enter]──→ title
  └─[AJUSTES]────────────────→ settings ──[Esc]──→ title

playing
  ├─[P / pausa]──────────────→ paused
  ├─[llega a BOSS_X]─────────→ bossFight
  ├─[sin vidas]──────────────→ gameOver ──[Enter]──→ playing
  └─[victoria animación]─────→ victory ──[Enter]──→ title

bossFight
  ├─[P / pausa]──────────────→ paused
  ├─[boss.hp <= 0]───────────→ (transforming 3200ms) → victory
  └─[sin vidas]──────────────→ gameOver

paused
  ├─[CONTINUAR]──────────────→ playing | bossFight
  ├─[REINICIAR]──────────────→ playing (reset)
  └─[MENU PRINCIPAL]─────────→ title
```

---

## 🚀 Desarrollo local

### Prerrequisitos
- [Firebase CLI](https://firebase.google.com/docs/cli) instalado
- Cuenta en Firebase con acceso al proyecto `jesus-salva-la-humanidad`

### Correr localmente
```bash
# Clonar
git clone https://github.com/djbrait/JesusSalvaLaHumanidad.git
cd JesusSalvaLaHumanidad

# Servir con Firebase (puerto 5001, ya que 5000 está ocupado)
firebase serve --port 5001

# O simplemente abrir en navegador:
# Abrir index.html directamente — no requiere servidor
```

### Deploy a producción
```bash
firebase deploy
```

---

## 📋 Historial de versiones

| Versión | Descripción |
|---------|-------------|
| v1.0 (inicial) | Juego completo: audio, nivel, mecánicas, jefe |
| v1.1 | Fix: bugs título (menuSel, titleSel %3, boss null crash) |
| v1.2 | Fix: enemies invisible (var global faltante), Jesus invisible, escenario Nazaret, ajustes funcional |
| v1.3 | Fix: rendering (fadeAlpha typo). New: top-right version display. |
| v1.4 | Fix: version display visibility on all screens, pause menu 'Menu Principal' logic. |
| v1.5 | Fix: cache issues (bumped sw.js to v4). Improved version visibility. |
| v1.6 | Fix: version display bottom-right (no overlap), title screen visibility. Fix: pause menu redirect bug. Bumped sw.js to v5. |

---

## 🔧 Convenciones del código

- **Sin frameworks, sin bundler, sin módulos** — todo inline en `index.html`
- Variables con `var` (ES5), sin `let`/`const` para mayor compatibilidad
- Sin template literals con `${}` (para evitar conflictos con PowerShell here-strings durante desarrollo)
- Todos los gráficos dibujados con primitivas Canvas 2D (`fillRect`, `arc`, `bezierCurveTo`, etc.)
- No hay imágenes externas, fuentes web ni dependencias de red en runtime
- `fc` (frame counter) se incrementa en cada llamada al game loop y se usa para animaciones

---

## 📁 Firebase

- **Proyecto:** `jesus-salva-la-humanidad`
- **Hosting URL:** https://jesus-salva-la-humanidad.web.app
- **Puerto local:** 5001 (configurado en `firebase.json`)
- **Cache:** `index.html` y `sw.js` siempre sin caché (headers `no-cache`)
- **Service Worker:** `jesus-salva-v1` (network-first strategy)
