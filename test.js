// Mock mínimo de globals del browser
global.window = { addEventListener: function(){}, innerWidth: 960, innerHeight: 540 };

function makeCtx2d() {
    var noop = function(){ return makeCtx2d(); };
    return {
        fillStyle:'', strokeStyle:'', lineWidth:1, globalAlpha:1, font:'', textAlign:'left',
        shadowColor:'', shadowBlur:0,
        fillRect:noop, clearRect:noop, strokeRect:noop,
        fillText:noop, strokeText:noop, measureText:function(){ return {width:0}; },
        beginPath:noop, closePath:noop, moveTo:noop, lineTo:noop,
        arc:noop, rect:noop, fill:noop, stroke:noop, clip:noop,
        save:noop, restore:noop, translate:noop, rotate:noop, scale:noop,
        drawImage:noop, createLinearGradient:function(){ return {addColorStop:noop}; },
        createRadialGradient:function(){ return {addColorStop:noop}; },
        setTransform:noop, resetTransform:noop,
        quadraticCurveTo:noop, bezierCurveTo:noop,
        createPattern:function(){ return null; }
    };
}

function makeElement() {
    return {
        style:{}, classList:{add:function(){},remove:function(){}},
        getBoundingClientRect: function(){ return {top:0,bottom:540,left:0,right:960}; },
        addEventListener: function(){},
        width: 960, height: 540,
        getContext: function(){ return makeCtx2d(); }
    };
}

global.document = {
    getElementById: function(){ return makeElement(); },
    addEventListener: function(){}
};
global.navigator = { maxTouchPoints: 0 };
global.requestAnimationFrame = function(){};
function MockAudioContext() {
    this.currentTime = 0;
    this.state = 'running';
    this.destination = {};
    this.resume = function(){};
    this.createOscillator = function(){ return {connect:function(){},start:function(){},stop:function(){},type:'sine',frequency:{value:0}}; };
    this.createGain = function(){ return {connect:function(){},gain:{setValueAtTime:function(){},exponentialRampToValueAtTime:function(){}},destination:{}}; };
}
global.AudioContext = MockAudioContext;
global.webkitAudioContext = MockAudioContext;
// Attach to window so the game's "const AudioCtx = window.AudioContext" picks it up
global.window.AudioContext = MockAudioContext;
global.window.webkitAudioContext = MockAudioContext;

// Cargar el juego
const fs = require('fs');
const assert = require('assert');
const html = fs.readFileSync('index.html', 'utf8');
const scriptContent = html.match(/<script>([\s\S]*?)<\/script>/)[1];
eval(scriptContent);

let passed = 0, failed = 0;
function test(name, fn) {
    try { fn(); console.log('  ✓', name); passed++; }
    catch(e) { console.error('  ✗', name, '\n   ', e.message); failed++; }
}

console.log('\n=== rectHit (colisiones) ===');
test('colision: rects superpuestos', () => assert.strictEqual(rectHit({x:0,y:0,w:10,h:10},{x:5,y:5,w:10,h:10}), true));
test('colision: rects separados', () => assert.strictEqual(rectHit({x:0,y:0,w:10,h:10},{x:20,y:0,w:10,h:10}), false));
test('colision: bordes tocandose (no colision)', () => assert.strictEqual(rectHit({x:0,y:0,w:10,h:10},{x:10,y:0,w:10,h:10}), false));
test('colision: mismo punto', () => assert.strictEqual(rectHit({x:5,y:5,w:1,h:1},{x:5,y:5,w:1,h:1}), true));

console.log('\n=== makePlayer ===');
test('makePlayer: posicion inicial', () => { const p=makePlayer(80); assert.strictEqual(p.x,80); });
test('makePlayer: hp inicial 5', () => { const p=makePlayer(80); assert.strictEqual(p.hp,5); });
test('makePlayer: fe inicial 0', () => { const p=makePlayer(80); assert.strictEqual(p.faith,0); });
test('makePlayer: doble salto disponible', () => { const p=makePlayer(80); assert.strictEqual(p.jumpsLeft,2); });
test('makePlayer: no agachado al inicio', () => { const p=makePlayer(80); assert.strictEqual(p.crouching,false); });

console.log('\n=== makeLevel ===');
test('makeLevel: tiene plataformas', () => { const l=makeLevel(); assert(l.platforms.length>0); });
test('makeLevel: 2 checkpoints', () => { const l=makeLevel(); assert.strictEqual(l.checkpoints.length,2); });
test('makeLevel: checkpoint 2 cerca del jefe', () => { const l=makeLevel(); assert(l.checkpoints[1].x >= 4000,'checkpoint 2 debe estar cerca del boss'); });
test('makeLevel: tiene enemigos', () => { const l=makeLevel(); assert(l.enemies.length>0); });
test('makeLevel: tiene monedas', () => { const l=makeLevel(); assert(l.coins.length>0); });
test('makeLevel: bossZone es BOSS_X', () => { const l=makeLevel(); assert.strictEqual(l.bossZone,BOSS_X); });

console.log('\n=== lerpN / lerpC ===');
test('lerpN t=0', () => assert.strictEqual(lerpN(0,100,0),0));
test('lerpN t=1', () => assert.strictEqual(lerpN(0,100,1),100));
test('lerpN t=0.5', () => assert.strictEqual(lerpN(0,100,0.5),50));
test('lerpC mezcla colores', () => { const r=lerpC('#000000','#ffffff',0.5); assert(r.includes('127')||r.includes('128')); });

console.log('\n=== constantes del juego ===');
test('TILE = 40', () => assert.strictEqual(TILE,40));
test('LEVEL_W = 5200', () => assert.strictEqual(LEVEL_W,5200));
test('BOSS_X = 4500', () => assert.strictEqual(BOSS_X,4500));
test('HELL_X = 3600', () => assert.strictEqual(HELL_X,3600));
test('JUMP < 0 (impulso hacia arriba)', () => assert(JUMP<0));
test('GRAV > 0 (gravedad hacia abajo)', () => assert(GRAV>0));

console.log('\n=== castBlessing ===');
test('castBlessing: resta fe', () => {
    player=makePlayer(80); level=makeLevel();
    camera={x:0,y:0}; particles=[]; blessingWaves=[];
    player.faith=60; castBlessing();
    assert(player.faith<60,'fe debe disminuir');
});
test('castBlessing: convierte enemigos cercanos', () => {
    player=makePlayer(80); level=makeLevel();
    camera={x:0,y:0}; particles=[]; blessingWaves=[];
    player.faith=60;
    // poner enemigo cerca
    level.enemies[0].x=90; level.enemies[0].y=400;
    level.enemies[0].converted=false; level.enemies[0].alive=true;
    castBlessing();
    assert(level.enemies[0].converted,'enemigo cercano debe convertirse');
});

console.log('\n=== makeBoss ===');
test('makeBoss: hp inicial 30', () => { const b=makeBoss(); assert.strictEqual(b.hp,30); });
test('makeBoss: fase inicial 1', () => { const b=makeBoss(); assert.strictEqual(b.phase,1); });
test('makeBoss: no derrotado al inicio', () => { const b=makeBoss(); assert.strictEqual(b.defeated,false); });

const total = passed + failed;
console.log(`\n${passed}/${total} tests pasaron`);
if (failed > 0) { console.error(`${failed} tests fallaron`); process.exit(1); }
