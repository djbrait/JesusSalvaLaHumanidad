# Jesús Salva a la Humanidad

PWA platformer 2D. Todo el juego está en `index.html` (JS + HTML + CSS inline, sin frameworks).

## Deploy
firebase deploy --only hosting → https://jesus-salva-la-humanidad.web.app

## Tests
node test.js

## Íconos
node generate-icons.js   (genera icons/*.png con cruz de madera, puro Node.js sin npm)

## Controles
| Tecla | Acción |
|-------|--------|
| ←/→   | Moverse |
| ↑ / Espacio | Saltar (doble salto) |
| ↓ | Agacharse |
| Shift | Dash |
| Z (mantener) | Agua bendita — auto-apunta al enemigo más cercano |
| X | Bendición en área (radio 380px, cuesta 30 fe) |
| P | Pausa |

## Arquitectura de index.html
- AUDIO: AudioContext + melodies EARTH/HELL, música procedural
- INPUT: keys{} + touchKeys{} unificados en isDown()
- LEVEL: makeLevel() — plataformas, enemigos, monedas, 2 checkpoints
- PLAYER: makePlayer() — física, animaciones, fe, agacharse
- BOSS: makeBoss() — 3 fases, proyectiles, transformación a ángel
- CAMERA: scroll horizontal siguiendo al jugador
- DRAW: drawBg, drawPlatforms, drawPossessed, drawDevil, drawJesus, drawBlessingWaves
- STATES: title → story → playing → bossFight → victory / gameOver
