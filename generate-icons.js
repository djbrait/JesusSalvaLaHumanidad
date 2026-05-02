const fs = require('fs');
const zlib = require('zlib');

const crcT = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    crcT[i] = c;
}
function crc32(b) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < b.length; i++) c = crcT[(c ^ b[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
}
function chunk(type, data) {
    const t = Buffer.from(type, 'ascii');
    const all = Buffer.concat([t, data]);
    const out = Buffer.alloc(4 + 4 + data.length + 4);
    out.writeUInt32BE(data.length, 0);
    t.copy(out, 4); data.copy(out, 8);
    out.writeUInt32BE(crc32(all), 8 + data.length);
    return out;
}

function generatePNG(size) {
    const px = new Uint8Array(size * size * 4);
    const cx = size / 2, cy = size / 2;

    // Background: dark blue #091a45
    for (let i = 0; i < size * size; i++) {
        px[i*4]=9; px[i*4+1]=26; px[i*4+2]=69; px[i*4+3]=255;
    }

    // Golden radial glow
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
        const d = Math.sqrt((x-cx)*(x-cx)+(y-cy)*(y-cy));
        const t = Math.max(0, 1 - d/(size*0.42));
        const a = t*t*0.55, i4=(y*size+x)*4;
        px[i4]  = Math.min(255, px[i4]   + Math.round(a*(255-9)));
        px[i4+1]= Math.min(255, px[i4+1] + Math.round(a*(215-26)));
        px[i4+2]= Math.min(255, px[i4+2] + Math.round(a*(0-69)));
    }

    // Cross bounds
    const vw=Math.round(size*0.17), hw=Math.round(size*0.15);
    const vx1=Math.round(cx-vw/2), vx2=vx1+vw;
    const vy1=Math.round(size*0.10), vy2=Math.round(size*0.90);
    const hx1=Math.round(size*0.12), hx2=Math.round(size*0.88);
    const hy1=Math.round(size*0.28), hy2=hy1+hw;

    // Shadow
    for (let y=0;y<size;y++) for (let x=0;x<size;x++) {
        const inV=x>=vx1+5&&x<vx2+5&&y>=vy1+5&&y<vy2+5;
        const inH=x>=hx1+5&&x<hx2+5&&y>=hy1+5&&y<hy2+5;
        if (inV||inH){const i4=(y*size+x)*4;px[i4]=15;px[i4+1]=8;px[i4+2]=3;px[i4+3]=200;}
    }

    // Wooden cross with grain
    for (let y=0;y<size;y++) for (let x=0;x<size;x++) {
        const inV=x>=vx1&&x<vx2&&y>=vy1&&y<vy2;
        const inH=x>=hx1&&x<hx2&&y>=hy1&&y<hy2;
        if (!inV&&!inH) continue;
        const grain=(Math.sin(y*0.18+x*0.03)*18+Math.sin(x*0.12+y*0.01)*10);
        let r=115+grain, g=60+grain*0.5, b=28;
        // left/top highlight
        if (inV&&x<vx1+vw*0.28){r+=38;g+=22;}
        if (inH&&y<hy1+hw*0.28){r+=38;g+=22;}
        // right/bottom shadow
        if (inV&&x>vx2-vw*0.22){r-=28;g-=16;}
        if (inH&&y>hy2-hw*0.22){r-=28;g-=16;}
        const i4=(y*size+x)*4;
        px[i4]=Math.max(0,Math.min(255,r));
        px[i4+1]=Math.max(0,Math.min(255,g));
        px[i4+2]=Math.max(0,Math.min(255,b));
        px[i4+3]=255;
    }

    // Raw scanlines with filter=0
    const raw=Buffer.alloc(size*(1+size*4));
    for (let y=0;y<size;y++) {
        raw[y*(1+size*4)]=0;
        for (let x=0;x<size;x++) {
            const pi=(y*size+x)*4, di=y*(1+size*4)+1+x*4;
            raw[di]=px[pi]; raw[di+1]=px[pi+1]; raw[di+2]=px[pi+2]; raw[di+3]=px[pi+3];
        }
    }

    const ihdr=Buffer.alloc(13);
    ihdr.writeUInt32BE(size,0); ihdr.writeUInt32BE(size,4);
    ihdr[8]=8; ihdr[9]=6;

    return Buffer.concat([
        Buffer.from([137,80,78,71,13,10,26,10]),
        chunk('IHDR', ihdr),
        chunk('IDAT', zlib.deflateSync(raw)),
        chunk('IEND', Buffer.alloc(0))
    ]);
}

if (!fs.existsSync('icons')) fs.mkdirSync('icons');
[192, 512].forEach(s => {
    const data = generatePNG(s);
    fs.writeFileSync(`icons/icon-${s}.png`, data);
    fs.writeFileSync(`icons/icon-${s}-maskable.png`, data);
    console.log(`icons/icon-${s}.png generated (${data.length} bytes)`);
});
console.log('Done!');
