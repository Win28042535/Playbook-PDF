// Flatten an aged-paper ground to white (2026-10-28, the "New Style" opener drawings): scale to the target width, estimate the
// paper under every pixel (a max filter wipes the ink, a box blur smooths the grain), divide the image by that estimate, so the
// paper — open or enclosed — becomes white while every line, hatch and tint keeps its tone relative to it. On the sheet the result
// multiplies into the book's paper like the other line drawings (.parch .pbx-ill). Written as a JPEG (white ground, no alpha).
// Runs in headless Chrome (canvas), like tools/map-tint.js.
// usage: node tools/flatten-paper.js <src.png> <out.jpg> <width px>   (needs the dev server on PORT, default 8731; src under the project)
const { spawn } = require('child_process'), fs = require('fs'), path = require('path'), os = require('os');
const [src, out, S] = process.argv.slice(2), PORT = process.env.PORT || 8731, DBG = 9338, ROOT = path.join(__dirname, '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const FLAT = async (url, S) => {
  const im = new Image(); im.src = url; await im.decode();
  const W = S, H = Math.round(S * im.naturalHeight / im.naturalWidth), c = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
  c.width = W; c.height = H; const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(im, 0, 0, W, H);
  const d = g.getImageData(0, 0, W, H), p = d.data, N = W * H;
  const pass = (src, r, op) => { const t = new Float32Array(N), o = new Float32Array(N); // separable max / mean
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let v = op === 'max' ? 0 : 0; for (let k = -r; k <= r; k++) { const s = src[y * W + Math.min(W - 1, Math.max(0, x + k))]; v = op === 'max' ? Math.max(v, s) : v + s; } t[y * W + x] = op === 'max' ? v : v / (2 * r + 1); }
    for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) { let v = 0; for (let k = -r; k <= r; k++) { const s = t[Math.min(H - 1, Math.max(0, y + k)) * W + x]; v = op === 'max' ? Math.max(v, s) : v + s; } o[y * W + x] = op === 'max' ? v : v / (2 * r + 1); }
    return o; };
  const R = Math.max(3, Math.round(W / 120)), B = Math.max(10, Math.round(W / 30));
  // the paper estimate (2026-10-28): a first guess from max + blur, then only pixels within ±6% of it count as paper — ink is below,
  // glints and bright rims are above — and the estimate is rebuilt from those alone, so a bright rim no longer lifts the paper
  // beside it (it left a beige halo outside the book's curved top)
  const B2 = Math.max(16, Math.round(W / 18));
  for (let ch = 0; ch < 3; ch++) {
    const v = new Float32Array(N); for (let i = 0; i < N; i++) v[i] = p[i * 4 + ch];
    const g0 = pass(pass(v, R, 'max'), B, 'mean'), num = new Float32Array(N), den = new Float32Array(N);
    for (let i = 0; i < N; i++) { const ok = Math.abs(v[i] - g0[i]) < g0[i] * .06; num[i] = ok ? v[i] : 0; den[i] = ok ? 1 : 0; }
    const sn = pass(num, B2, 'mean'), sd = pass(den, B2, 'mean'), bg = new Float32Array(N);
    for (let i = 0; i < N; i++) bg[i] = sd[i] > .02 ? sn[i] / sd[i] : g0[i];
    for (let i = 0; i < N; i++) p[i * 4 + ch] = Math.min(255, Math.round(v[i] / Math.max(1, bg[i]) * 255 * 1.02)); // 2% lift so the grain clears to white
  }
  // trim to the ink (anything visibly off white), with a 2% margin, so the drawing fills its box like the old drawings
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  const E = Math.round(W * .025); // the outermost band can keep a trace of the source's vignette: not ink
  for (let y = E; y < H - E; y++) for (let x = E; x < W - E; x++) { const i = (y * W + x) * 4; if (Math.min(p[i], p[i + 1], p[i + 2]) < 215) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
  const m = Math.round(Math.max(x1 - x0, y1 - y0) * .02); x0 = Math.max(0, x0 - m); y0 = Math.max(0, y0 - m); x1 = Math.min(W - 1, x1 + m); y1 = Math.min(H - 1, y1 + m);
  g.putImageData(d, 0, 0);
  const o = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas'); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1;
  const og = o.getContext('2d'); og.fillStyle = '#fff'; og.fillRect(0, 0, o.width, o.height); og.drawImage(c, x0, y0, o.width, o.height, 0, 0, o.width, o.height);
  return o.toDataURL('image/jpeg', .9).split(',')[1];
};
(async () => {
  const ch = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--remote-debugging-port=' + DBG, '--user-data-dir=' + fs.mkdtempSync(path.join(os.tmpdir(), 'flat-')), 'about:blank']);
  let tabs; for (let i = 0; i < 40; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${DBG}/json`)).json(); break; } catch { await sleep(250); } }
  const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
  let id = 0; const pend = {}; ws.onmessage = e => { const m = JSON.parse(e.data); if (pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } };
  const cmd = (method, params = {}) => new Promise(r => { pend[++id] = r; ws.send(JSON.stringify({ id, method, params })); });
  await cmd('Page.enable'); await cmd('Page.navigate', { url: `http://localhost:${PORT}/assets/` }); await sleep(1000);
  const url = '/' + path.relative(ROOT, path.resolve(src)).split(path.sep).map(encodeURIComponent).join('/');
  const r = await cmd('Runtime.evaluate', { expression: `(${FLAT})(${JSON.stringify(url)},${+S})`, awaitPromise: true, returnByValue: true });
  if (!r.result || r.result.type !== 'string') console.log('failed', JSON.stringify(r).slice(0, 300));
  else { fs.writeFileSync(out, Buffer.from(r.result.value, 'base64')); console.log(Math.round(fs.statSync(out).size / 1024) + ' KB'); }
  ws.close(); ch.kill();
})();
