// Cut a baked-in transparency checkerboard out of a flat RGB image (2026-10-27: the vintage warning badge came as RGB with the
// grey / white checker painted in). Flood-fills from the border through low-saturation light pixels, feathers the edge, trims,
// scales and writes a PNG with alpha. Runs in headless Chrome (canvas), like tools/map-tint.js.
// usage: node tools/cut-checker.js <src.png> <out.png> <longest side px> [checker|paper]   (needs the dev server on PORT, default 8731;
// src under the project). 'paper' cuts a light, mildly warm aged-paper ground instead of a grey checker.
const { spawn } = require('child_process'), fs = require('fs'), path = require('path'), os = require('os');
const [src, out, S] = process.argv.slice(2), PORT = process.env.PORT || 8731, DBG = 9337, ROOT = path.join(__dirname, '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const CUT = async (url, S, MODE) => {
  const im = new Image(); im.src = url; await im.decode();
  const W = im.naturalWidth, H = im.naturalHeight, c = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'); g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, W, H), p = d.data, N = W * H;
  const bg = i => { const r = p[i * 4], gg = p[i * 4 + 1], b = p[i * 4 + 2], mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
    if (MODE === 'paper') return mx > 105 && (mx - mn) / mx < .5 && !(mx > 150 && (mx - mn) / mx > .42);
    if (MODE === 'beige') return mx > 120 && r >= gg && gg >= b && r - b >= 12 && r - b <= 70 && gg - b >= 5 && (mx - mn) / mx < .32; // warm beige only: a pale, neutral or lavender metal is kept // aged paper: light and only mildly warm; the gold is far more saturated
    return mn > 150 && mx - mn < 16; }; // checker: light, near-grey (the second badge's checker is bluish grey with darker dots, ~171)
  const out = new Uint8Array(N), q = new Int32Array(N); let h = 0, t = 0; // 1 = background, reached from the border
  const push = i => { if (!out[i] && bg(i)) { out[i] = 1; q[t++] = i; } };
  for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); } for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
  while (h < t) { const i = q[h++], x = i % W, y = (i / W) | 0; if (x) push(i - 1); if (x < W - 1) push(i + 1); if (y) push(i - W); if (y < H - 1) push(i + W); }
  // enclosed checker (e.g. between a scale's chains): any other background-coloured region larger than ~0.03% of the image
  const seen = new Uint8Array(N), MIN = Math.max(400, N * .0003);
  // on paper the drawing's own pale gold is paper-coloured too (neither colour nor brightness tells them apart), so paper mode
  // clears only the border-reached ground; paper enclosed by the drawing (between a scale's chains) stays
  // in paper mode a region goes only when it is a large enclosed field off to one side of the drawing (a scale's chain triangles,
  // 2026-10-27): ≥ 1.5% of the image, its centre in the outer 32% left or right, and taller than wide
  const stats = [];
  for (let s = 0; s < N; s++) { if (out[s] || seen[s] || !bg(s)) continue;
    const reg = [s]; seen[s] = 1; for (let k = 0; k < reg.length; k++) { const i = reg[k], x = i % W, y = (i / W) | 0;
      for (const j of [x ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y ? i - W : -1, y < H - 1 ? i + W : -1]) if (j >= 0 && !seen[j] && !out[j] && bg(j)) { seen[j] = 1; reg.push(j); } }
    if (reg.length <= MIN) continue;
    if (MODE === 'paper' || MODE === 'beige') {
      let sx = 0, bx0 = W, bx1 = 0, by0 = H, by1 = 0; for (const i of reg) { const x = i % W, y = (i / W) | 0; sx += x; if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y; }
      const cx = sx / reg.length / W, side = cx < .32 || cx > .68, tall = (by1 - by0) > (bx1 - bx0);
      stats.push([reg.length, +cx.toFixed(2), bx1 - bx0, by1 - by0].join('/'));
      if (!(reg.length > N * .015 && side && tall)) continue;
    }
    for (const i of reg) out[i] = 1; }
  if (MODE === 'paper') console.log('regions', stats.join(' '));
  // stray specks (paper stains): kept islands under ~0.15% of the image are background too
  const seen2 = new Uint8Array(N), SPECK = N * .0015;
  for (let s = 0; s < N; s++) { if (out[s] || seen2[s]) continue;
    const reg = [s]; seen2[s] = 1; for (let k = 0; k < reg.length; k++) { const i = reg[k], x = i % W, y = (i / W) | 0;
      for (const j of [x ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y ? i - W : -1, y < H - 1 ? i + W : -1]) if (j >= 0 && !seen2[j] && !out[j]) { seen2[j] = 1; reg.push(j); } }
    if (reg.length < SPECK) for (const i of reg) out[i] = 1; }
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x;
    let n = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < W && yy < H && out[yy * W + xx]) n++; }
    p[i * 4 + 3] = out[i] ? 0 : Math.round(255 * (1 - n / 9 * .6)); // a one-pixel soft edge
    if (!out[i]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
  g.putImageData(d, 0, 0);
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1, k = S / Math.max(cw, ch), o = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
  o.width = Math.round(cw * k); o.height = Math.round(ch * k); const og = o.getContext('2d'); og.imageSmoothingQuality = 'high'; og.drawImage(c, x0, y0, cw, ch, 0, 0, o.width, o.height);
  return o.toDataURL('image/png').split(',')[1];
};
(async () => {
  const ch = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--remote-debugging-port=' + DBG, '--user-data-dir=' + fs.mkdtempSync(path.join(os.tmpdir(), 'cut-')), 'about:blank']);
  let tabs; for (let i = 0; i < 40; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${DBG}/json`)).json(); break; } catch { await sleep(250); } }
  const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
  let id = 0; const pend = {}; ws.onmessage = e => { const m = JSON.parse(e.data); if (pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } };
  const cmd = (method, params = {}) => new Promise(r => { pend[++id] = r; ws.send(JSON.stringify({ id, method, params })); });
  await cmd('Page.enable'); await cmd('Page.navigate', { url: `http://localhost:${PORT}/assets/` }); await sleep(1000);
  const url = '/' + path.relative(ROOT, path.resolve(src)).split(path.sep).map(encodeURIComponent).join('/');
  const r = await cmd('Runtime.evaluate', { expression: `(${CUT})(${JSON.stringify(url)},${+S},${JSON.stringify(process.argv[5] || 'checker')})`, awaitPromise: true, returnByValue: true });
  if (!r.result || r.result.type !== 'string') { console.log('failed', JSON.stringify(r).slice(0, 300)); } else { fs.writeFileSync(out, Buffer.from(r.result.value, 'base64')); console.log(Math.round(fs.statSync(out).size / 1024) + ' KB'); }
  ws.close(); ch.kill();
})();
