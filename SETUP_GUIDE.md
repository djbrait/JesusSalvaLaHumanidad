# 🎮 Jesús Salva a la Humanidad - Guía de Configuración Local

## Requisitos Instalados

- ✅ Git 2.54.0
- ⏳ Node.js LTS v22 (instalando)
- ⏳ Firebase CLI (próximo)

## Desarrollo Local

### Opción 1: Abrir directamente en navegador
```bash
# Abrir index.html en tu navegador (funciona desde file://)
start index.html
```
⚠️ **Limitaciones:**
- Service Worker no funciona correctamente desde file://
- Algunas APIs pueden tener restricciones

### Opción 2: Servir localmente con Firebase (recomendado)
```bash
firebase serve --port 5001
# Abrir: http://localhost:5001
```

### Opción 3: Servidor HTTP simple con Node.js
```bash
node -e "const http=require('http'); const fs=require('fs'); http.createServer((r,s)=>{const f=require('path').join(process.cwd(),r.url==='/'?'index.html':r.url);fs.readFile(f,(e,c)=>s.end(e?'404':c))}).listen(5001); console.log('http://localhost:5001')"
```

## Controles del Juego

### Teclado (Escritorio)
| Tecla | Acción |
|-------|--------|
| ← → | Mover |
| Espacio | Saltar (doble salto) |
| Shift | Dash |
| Z | Lanzar agua bendita |
| X | Escudo de fe |
| P | Pausa |

### Táctil (Móvil)
- 7 botones superpuestos al canvas

## Git & GitHub

### Ver estado
```bash
git status
```

### Realizar cambios
```bash
git add .
git commit -m "descripción del cambio"
git push origin master
```

### Ver remoto
```bash
git remote -v
```

## Firebase Hosting

### Proyecto
- **Nombre:** jesus-salva-la-humanidad
- **URL:** https://jesus-salva-la-humanidad.web.app
- **Puerto local:** 5001

### Autenticación
```bash
firebase login
```

### Deploy a producción
```bash
firebase deploy
```

### Ver estado de hosting
```bash
firebase hosting:sites:list
```

## Estructura de Archivos Importante

```
index.html          - Juego completo (sin dependencias externas)
sw.js              - Service Worker (cache offline)
manifest.json      - PWA metadata
firebase.json      - Config Firebase Hosting
.firebaserc        - Proyecto Firebase (ya corregido)
icons/             - Iconos PWA (192x512, normal + maskable)
```

## Notas de Desarrollo

- **Sin frameworks:** Vanilla JavaScript ES5
- **Sin bundler:** Todo inline en index.html
- **Sin imágenes:** Todo dibujado con Canvas 2D
- **Sin audio externo:** Todo generado con Web Audio API
- **Compatible:** Todos los navegadores modernos + offline

## Problemas Conocidos

### Firebase CLI con Node v25
❌ Node.js v25.9.0 es incompatible con Firebase CLI
✅ Solución: Instalar Node.js v22 LTS

### Token de GitHub en .git/config
⚠️ El token está expuesto en la URL del remote
✅ Solución: Rotar token en GitHub y usar Git Credential Manager

## Próximos Pasos

1. Esperar instalación de Node.js LTS v22
2. Instalar Firebase CLI: `npm install -g firebase-tools`
3. Autenticarse: `firebase login`
4. Servir localmente: `firebase serve --port 5001`
5. Probar juego en: http://localhost:5001
6. Hacer cambios y hacer push: `git push origin master`
7. Deploy a producción: `firebase deploy`

---

**Última actualización:** 2026-05-02 22:45 UTC
