/**
 * Chico Estrella - Suite de Tests Automatizados
 * Ejecutar: node tests/game-tests.js
 * Se debe ejecutar después de CADA modificación al index.html
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const HTML_PATH = path.join(__dirname, '..', 'index.html');
const SW_PATH   = path.join(__dirname, '..', 'sw.js');
const JS_TMP    = path.join(__dirname, '..', 'tests', '_extracted.js');

let passed = 0, failed = 0, warned = 0;
const results = [];

function test(name, fn) {
    try {
        const msg = fn();
        results.push({ status: '✅', name, msg: msg || '' });
        passed++;
    } catch (e) {
        results.push({ status: '❌', name, msg: e.message });
        failed++;
    }
}

function warn(name, fn) {
    try {
        fn();
        results.push({ status: '✅', name, msg: '' });
        passed++;
    } catch (e) {
        results.push({ status: '⚠️ ', name, msg: e.message });
        warned++;
    }
}

function assert(cond, msg) {
    if (!cond) throw new Error(msg);
}

function contains(js, pattern, desc) {
    const found = typeof pattern === 'string' ? js.includes(pattern) : pattern.test(js);
    assert(found, `No se encontró: ${desc || pattern}`);
}

function notContains(js, pattern, desc) {
    const found = typeof pattern === 'string' ? js.includes(pattern) : pattern.test(js);
    assert(!found, `No debería existir: ${desc || pattern}`);
}

function count(js, pattern) {
    return (js.match(pattern) || []).length;
}

// ─── Cargar archivos ──────────────────────────────────────────────────────────

const html = fs.readFileSync(HTML_PATH, 'utf8');
const sw   = fs.readFileSync(SW_PATH, 'utf8');

// Extraer el bloque <script>
const scriptStart = html.indexOf('<script>') + '<script>'.length;
const scriptEnd   = html.lastIndexOf('</script>');
const js = html.substring(scriptStart, scriptEnd);
fs.writeFileSync(JS_TMP, js, 'utf8');

// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 1: INTEGRIDAD SINTÁCTICA
// ═══════════════════════════════════════════════════════════════════════════════

test('Sintaxis JS válida (node --check)', () => {
    try {
        execSync(`node --check "${JS_TMP}"`, { stdio: 'pipe' });
    } catch (e) {
        throw new Error(e.stderr.toString().split('\n').slice(0, 3).join(' '));
    }
});

test('Llaves balanceadas { }', () => {
    const open  = (js.match(/\{/g) || []).length;
    const close = (js.match(/\}/g) || []).length;
    assert(open === close, `{ = ${open}, } = ${close}, diff = ${open - close}`);
});

test('Paréntesis balanceados ( )', () => {
    // Ignorar strings y comentarios de forma simple: solo contamos fuera de strings
    let depth = 0, inStr = false, strChar = '', inLineComment = false, inBlockComment = false;
    for (let i = 0; i < js.length; i++) {
        const c = js[i], n = js[i+1];
        if (inLineComment)  { if (c === '\n') inLineComment = false; continue; }
        if (inBlockComment) { if (c === '*' && n === '/') { inBlockComment = false; i++; } continue; }
        if (inStr)          { if (c === strChar && js[i-1] !== '\\') inStr = false; continue; }
        if (c === '/' && n === '/') { inLineComment = true; continue; }
        if (c === '/' && n === '*') { inBlockComment = true; continue; }
        if (c === '"' || c === "'" || c === '`') { inStr = true; strChar = c; continue; }
        if (c === '(') depth++;
        if (c === ')') depth--;
    }
    assert(depth === 0, `( desbalanceados, diff = ${depth}`);
});

// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 2: VERSIONES Y SERVICE WORKER
// ═══════════════════════════════════════════════════════════════════════════════

test('GAME_VERSION declarado', () => {
    const m = js.match(/const GAME_VERSION = '(\d+\.\d+)'/);
    assert(m, 'GAME_VERSION no encontrado');
    return `v${m[1]}`;
});

test('SW cache version declarado', () => {
    const m = sw.match(/chico-estrella-v(\d+)/);
    assert(m, 'Cache name no encontrado en sw.js');
    return `cache v${m[1]}`;
});

// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 3: ESTRUCTURA DE NIVELES
// ═══════════════════════════════════════════════════════════════════════════════

test('LEVEL_THEMES tiene exactamente 10 niveles', () => {
    const m = js.match(/const LEVEL_THEMES = \[([\s\S]*?)\];/);
    assert(m, 'LEVEL_THEMES no encontrado');
    const entries = (m[1].match(/\{[^}]+\}/g) || []);
    assert(entries.length === 10, `Se encontraron ${entries.length} temas, se esperaban 10`);
    return `${entries.length} niveles`;
});

test('Nivel 10 ("El Espacio Final") existe en LEVEL_THEMES', () => {
    contains(js, 'El Espacio Final', 'El Espacio Final en LEVEL_THEMES');
});

test('STORIES tiene 10 historias', () => {
    // Contar sub-arrays anidados a profundidad 2 dentro de STORIES
    const start = js.indexOf('const STORIES = [');
    assert(start >= 0, 'const STORIES no encontrado');
    let depth = 0, count2 = 0;
    for (let i = start; i < js.length; i++) {
        if (js[i] === '[') { depth++; if (depth === 2) count2++; }
        if (js[i] === ']') { depth--; if (depth === 0) break; }
    }
    assert(count2 === 10, `Se encontraron ${count2} historias, se esperaban 10`);
    return `${count2} historias`;
});

test('Historia del Rey de los Anillos existe', () => {
    contains(js, 'Rey de los Anillos', 'Nombre del Rey en STORIES');
    contains(js, /anillos de poder|dominar/i, 'Contenido de historia del Rey');
});

// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 4: CONFIGURACIÓN DE JEFES
// ═══════════════════════════════════════════════════════════════════════════════

test('createBoss() tiene 10 entradas (índices 0-9)', () => {
    // Contar "{ // " patron de cada jefe en createBoss
    const bossBlock = js.match(/function createBoss[\s\S]*?^}/m);
    assert(bossBlock, 'createBoss no encontrado');
    // Contar la cantidad de objetos de configuración de jefe (buscamos el array de retorno)
    const commentBosses = (bossBlock[0].match(/\/\/ .*level/gi) || []).length;
    // Alternativa: contar apariciones de 'type:' dentro de createBoss
    const typeCount = (bossBlock[0].match(/type:/g) || []).length;
    assert(typeCount >= 10, `Solo ${typeCount} tipos de jefe en createBoss (se esperan ≥10)`);
    return `${typeCount} jefes`;
});

test('Rey de los Anillos definido en createBoss()', () => {
    contains(js, "type: 'reydelosanillos'", "type: 'reydelosanillos'");
    contains(js, "name: 'Rey de los Anillos'", "name: 'Rey de los Anillos'");
});

test('Rey de los Anillos tiene HP > 0', () => {
    const m = js.match(/Rey de los Anillos[\s\S]{0,200}hp:\s*(\d+)/);
    assert(m, 'HP del Rey no encontrado cerca de su definición');
    const hp = parseInt(m[1]);
    assert(hp > 0, `HP = ${hp}, debe ser > 0`);
    return `HP = ${hp}`;
});

test('drawReyDelosAnillos() declarada', () => {
    contains(js, 'function drawReyDelosAnillos(', 'drawReyDelosAnillos');
});

test('drawPEJ20 sin barra de vida en la cabeza', () => {
    // La barra de vida en la cabeza usaba ctx.fillRect con boss.hp/boss.maxHp dentro de drawPEJ20
    const drawBlock = js.match(/function drawPEJ20[\s\S]*?^}/m);
    assert(drawBlock, 'drawPEJ20 no encontrado');
    notContains(drawBlock[0], /boss\.hp.*maxHp.*fillRect|fillRect.*boss\.hp.*maxHp/,
        'barra de vida HP en drawPEJ20');
});

test('drawLarvaRayo sin barra de vida en la cabeza', () => {
    const drawBlock = js.match(/function drawLarvaRayo[\s\S]*?^}/m);
    assert(drawBlock, 'drawLarvaRayo no encontrado');
    notContains(drawBlock[0], /boss\.hp.*maxHp.*fillRect|fillRect.*boss\.hp.*maxHp/,
        'barra de vida HP en drawLarvaRayo');
});

test('drawChicoOpaco sin barra de vida en la cabeza', () => {
    const drawBlock = js.match(/function drawChicoOpaco[\s\S]*?^}/m);
    assert(drawBlock, 'drawChicoOpaco no encontrado');
    notContains(drawBlock[0], /boss\.hp.*maxHp.*fillRect|fillRect.*boss\.hp.*maxHp/,
        'barra de vida HP en drawChicoOpaco');
});

// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 5: SISTEMA DE HAMBURGUESAS
// ═══════════════════════════════════════════════════════════════════════════════

test('bossBurgerMax = 15 para nivel 9 en startBossFight()', () => {
    const bossStart = js.match(/function startBossFight[\s\S]*?^}/m);
    assert(bossStart, 'startBossFight no encontrado');
    contains(bossStart[0], /bossBurgerMax = .*15/, 'bossBurgerMax = 15 para nivel 9');
});

test('Sin push directo de 15 hamburguesas al morir el jefe', () => {
    // No debe haber un bucle "for (let bi = 0; bi < 15" que haga push a level.burgers
    notContains(js, /for.*bi.*15.*\n.*level\.burgers\.push/,
        'push directo de 15 burgers en bucle for');
});

test('Sistema de hamburguesas del jefe inline en updateBoss()', () => {
    // El sistema está embebido en updateBoss (no función separada)
    contains(js, 'bossBurgerCount < bossBurgerMax', 'bossBurgerCount < bossBurgerMax');
    contains(js, 'bossBurgerTimer >= bossBurgerInterval', 'bossBurgerTimer >= bossBurgerInterval');
    contains(js, 'level.burgers.push(', 'level.burgers.push');
});

test('bossBurgerTimer y bossBurgerInterval usados en update', () => {
    contains(js, 'bossBurgerTimer', 'bossBurgerTimer');
    contains(js, 'bossBurgerInterval', 'bossBurgerInterval');
});

// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 6: CÓDIGO SECRETO N10
// ═══════════════════════════════════════════════════════════════════════════════

test('secretBuffer soporta hasta 3 caracteres', () => {
    contains(js, /secretBuffer\.length > 3|secretBuffer\.slice\(-3\)/,
        'secretBuffer con largo 3');
});

test('Regex de código secreto soporta N10', () => {
    contains(js, /N\(10\|\[1-9\]\)|N10.*\[1-9\]/, 'regex N10|[1-9]');
});

test('Código N10 mapea al nivel 9 (índice)', () => {
    // N10 → levelNum = parseInt("10") - 1 = 9
    contains(js, "parseInt(match[1]) - 1", 'parseInt(match[1]) - 1');
});

// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 7: FLUJO DE JUEGO NIVEL 10
// ═══════════════════════════════════════════════════════════════════════════════

test('startFinalMusic() declarada', () => {
    contains(js, 'function startFinalMusic(', 'startFinalMusic');
});

test('stopFinalMusic() o stopMusic() llamada al terminar nivel 9', () => {
    // En levelComplete o bossFight death, debe llamarse stopMusic o stopFinalMusic
    contains(js, 'stopMusic()', 'stopMusic() llamada');
});

test('Game over en nivel 9 lleva al nivel 1 (currentLevel = 0)', () => {
    // Cuando pierde contra el Rey, debe resetear a nivel 0
    const goBlock = js.match(/gameOver[\s\S]{0,500}currentLevel.*=.*0|currentLevel.*=.*0[\s\S]{0,200}level.*10|nivel.*10/i);
    // Buscar de forma más simple: que currentLevel = 0 exista cerca del manejo de gameOver
    const loseCheck = /currentLevel >= 9[\s\S]{0,300}currentLevel = 0|lose.*level.*9|nivel 9.*restart/i;
    const directCheck = js.match(/if.*currentLevel.*[>=]=.*9[\s\S]{0,200}currentLevel\s*=\s*0/);
    assert(directCheck, 'No se encontró reset a level 0 cuando currentLevel >= 9');
});

test('Nivel 10 completado lleva a pantalla de victoria (no bonus)', () => {
    // Debe haber: currentLevel >= 9 → gameState = 'victory' en updateBonus o levelComplete
    const victoryCheck = js.match(/currentLevel.*>=?\s*9[\s\S]{0,300}gameState\s*=\s*'victory'|gameState\s*=\s*'victory'[\s\S]{0,300}currentLevel.*>=?\s*9/);
    assert(victoryCheck, 'No se encontró lógica victory para currentLevel >= 9');
});

// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 8: EXPLOSIÓN ARCOÍRIS
// ═══════════════════════════════════════════════════════════════════════════════

test('Explosión arcoíris al morir el Rey (hsl rainbow)', () => {
    // Buscar patrón hsl con variable hue cerca de reydelosanillos
    contains(js, /hsl\(\$\{hue\}.*60%\)/, 'hsl(${hue} 60%) para arcoíris');
    contains(js, "boss.type === 'reydelosanillos'", "bloque type === 'reydelosanillos' en muerte");
});

test('Explosión arcoíris en AMBOS paths de muerte (proyectil y salto)', () => {
    const rainbowCount = count(js, /hsl\(\$\{hue\}/g);
    assert(rainbowCount >= 2, `Solo ${rainbowCount} explosión/es arcoíris, se esperan ≥2 (proyectil + salto)`);
    return `${rainbowCount} bloques arcoíris`;
});

// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 9: FUNCIONES CRÍTICAS DEL JUEGO
// ═══════════════════════════════════════════════════════════════════════════════

const criticalFunctions = [
    'function update(', 'function draw(', 'function startLevel(',
    'function updateBoss(', 'function drawReyDelosAnillos(', 'function generateLevel(',
    'function createBoss(', 'function startBossFight(', 'function damagePlayer(',
    'function updatePlayer(', 'function drawBackground(', 'function drawUI(',
    'function fadeOut(', 'function fadeIn(',
    'function drawReyDelosAnillos('
];

criticalFunctions.forEach(fn => {
    test(`Función crítica: ${fn.replace('function ', '').replace('(', '')}`, () => {
        contains(js, fn, fn);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 10: FONDO ESPACIAL NIVEL 10
// ═══════════════════════════════════════════════════════════════════════════════

test('Fondo espacial para nivel 10 en drawBackground()', () => {
    const bgBlock = js.match(/function drawBackground[\s\S]*?^}/m);
    assert(bgBlock, 'drawBackground no encontrado');
    contains(bgBlock[0], /espac|space|currentLevel.*9|0D0D2B/i, 'fondo espacial nivel 10');
});

test('Piso de tierra espacial (color rojizo) en nivel 10', () => {
    contains(js, /8B0000|tierra espacial|groundColor.*8B0000/i, 'tierra espacial nivel 10');
});

// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 11: CINEMÁTICA (HISTORIA)
// ═══════════════════════════════════════════════════════════════════════════════

test('Historia nivel 1 menciona Buenos Aires', () => {
    contains(js, 'Buenos Aires', 'Buenos Aires en historia nivel 1');
});

test('Historia nivel 10 menciona "Rey de los Anillos"', () => {
    contains(js, 'Rey de los Anillos', 'Rey de los Anillos en historias');
});

// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 12: MÓVIL / PICKER
// ═══════════════════════════════════════════════════════════════════════════════

test('Level picker muestra todos los niveles dinámicamente', () => {
    // El picker itera LEVEL_THEMES.length y genera N${i+1} dinámicamente
    contains(js, 'for (let i = 0; i < LEVEL_THEMES.length', 'for loop en picker con LEVEL_THEMES.length');
    contains(js, /N\$\{i \+ 1\}|N\$\{i\+1\}/, 'botón N${i+1} dinámico');
});

// ═══════════════════════════════════════════════════════════════════════════════
// REPORTE FINAL
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(65));
console.log(' CHICO ESTRELLA — RESULTADOS DE TESTS');
console.log('═'.repeat(65));

results.forEach(r => {
    const msg = r.msg ? `  → ${r.msg}` : '';
    console.log(`${r.status} ${r.name}${msg}`);
});

console.log('─'.repeat(65));
console.log(`  Total: ${passed + failed + warned} tests  |  ✅ ${passed} OK  |  ❌ ${failed} FAIL  |  ⚠️  ${warned} WARN`);
console.log('═'.repeat(65) + '\n');

// Limpiar archivo temporal
try { fs.unlinkSync(JS_TMP); } catch {}

// Exit code 1 si hay fallos (para CI)
process.exit(failed > 0 ? 1 : 0);
