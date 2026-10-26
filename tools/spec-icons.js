// The spectrum glass marks (2026-10-26): Icon/*.png → trimmed to alpha > 8 → longest side 128px (2x of the largest use, ~64px)
// → assets/spec-<key>.png, plus a 48px spec-<key>-s.png for the in-line marks and a 200px spec-<key>-l.png for the still-life
// groups (≤ 100px on the sheet). PNG because Chrome's PDF keeps PNG / WebP lossless anyway, so the pixel count is what costs.
// usage: node tools/spec-icons.js
const { execFileSync } = require('child_process'), path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..'), SRC = path.join(ROOT, 'Icon'), OUT = path.join(ROOT, 'assets'), SIZES = { '': 128, '-s': 48, '-l': 200 };
const MAP = { stockth: 'หุ้นไทย', stockintl: 'หุ้นต่างประเทศ', bond: 'ตราสารหนี้', gold: 'ทอง', realestate: 'อสังหา', crypto: 'คริปโต',
  heart: 'หัวใจ', chest: 'ของสะสม', fund: 'พอร์ท', shield: 'โล่ มีเครื่องหมายถูกด้านใน', diamond: 'เพชร',
  bank: 'On-Event เพิ่มเติม/ธนาคาร', coin: 'On-Event เพิ่มเติม/เหรียญ ด้านในมี ฿',
  efin: '../Asset-element/efin.finance/efin.finance-1', boat: '../Asset-element/เรือ/เรือ' };
for (const [key, name] of Object.entries(MAP)) {
  const f = path.join(SRC, name + '.png');
  const [W, H] = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', f]).toString().trim().split(',').map(Number);
  const a = execFileSync('ffmpeg', ['-v', 'error', '-i', f, '-vf', 'format=rgba,alphaextract', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], { maxBuffer: 1e9 });
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (a[y * W + x] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1;
  for (const [suf, S] of Object.entries(SIZES)) {
    const o = path.join(OUT, 'spec-' + key + suf + '.png');
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', f, '-vf', `crop=${cw}:${ch}:${x0}:${y0},${cw >= ch ? `scale=${S}:-2` : `scale=-2:${S}`}:flags=lanczos,format=rgba`, '-compression_level', '100', '-pred', 'mixed', o]);
    console.log((key + suf).padEnd(13), `${cw}x${ch} →`, Math.round(fs.statSync(o).size / 1024) + ' KB');
  }
}
