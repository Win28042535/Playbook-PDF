// MAP DNA line tint (2026-10-27, MAP-DNA.md): every line drawing keeps its own line, hatching and white fills; only the INK
// changes colour, like an engraving printed in warm inks — lines warm brown where the light falls (upper left), near-black
// sepia on the shaded side and where the hatching is dense. No fill wash (dropped the same day, per direction). Rendered once
// in headless Chrome (canvas pixel pass) to assets/<name>.tint.png; the book uses them on map sheets (pbxMapSwap, pbxChrome).
// usage: node tools/map-tint.js   (needs the dev server on PORT, default 8731)
const { spawn } = require('child_process'), fs = require('fs'), path = require('path'), os = require('os');
const A = path.join(__dirname, '..', 'assets'), PORT = process.env.PORT || 8731, DBG = 9335;
// every drawing the book shows, at about 2x its largest box on the sheet
// (audit 2026-10-28: ~2x the largest box each is shown in — the compass watermark is drawn at 8% opacity, so 640 is plenty)
const W_OF = f => /^toc-compass/.test(f) ? 640 : /^orn-footer/.test(f) ? 244 : /^ill-/.test(f) ? 576 : /^eng-cat/.test(f) ? 296 : /^eng-(side|hook|hourglass|stetho|steps)/.test(f) ? 112 : 380;
const FILES = fs.readdirSync(A).filter(f => /^(ill|eng)-[^.]+\.(svg|png)$/.test(f) && !/^ill-bigrams/.test(f)).concat(['toc-compass.png', 'orn-footer.png']);
const CH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', sleep = ms => new Promise(r => setTimeout(r, ms));
// runs in the page: draw the file at width W, then recolour the ink of each pixel
const TINT = async (url, W, STYLE, GLINTS, FLAT) => {
  const im = new Image(); im.src = url; await im.decode();
  const H = Math.round(W * (im.naturalHeight || im.height) / (im.naturalWidth || im.width));
  const c = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas'); c.width = W; c.height = H; // (namespaced: the host page may be an SVG document)
  const g = c.getContext('2d'); g.drawImage(im, 0, 0, W, H);
  const d = g.getImageData(0, 0, W, H), p = d.data, N = W * H, ink = new Float32Array(N);
  for (let i = 0; i < N; i++) ink[i] = (p[i * 4 + 3] / 255) * (1 - (0.299 * p[i * 4] + 0.587 * p[i * 4 + 1] + 0.114 * p[i * 4 + 2]) / 255);
  // hatching density: a box blur of the ink (two passes) — high on the shaded side
  const blur = (src, r) => { const t = new Float32Array(N), o = new Float32Array(N);
    for (let y = 0; y < H; y++) { let s = 0; for (let x = -r; x <= r; x++) s += src[y * W + Math.min(W - 1, Math.max(0, x))];
      for (let x = 0; x < W; x++) { t[y * W + x] = s / (2 * r + 1); s += src[y * W + Math.min(W - 1, x + r + 1)] - src[y * W + Math.max(0, x - r)]; } }
    for (let x = 0; x < W; x++) { let s = 0; for (let y = -r; y <= r; y++) s += t[Math.min(H - 1, Math.max(0, y)) * W + x];
      for (let y = 0; y < H; y++) { o[y * W + x] = s / (2 * r + 1); s += t[Math.min(H - 1, y + r + 1) * W + x] - t[Math.max(0, y - r) * W + x]; } }
    return o; };
  const r = Math.max(2, Math.round(W / 82)), D = blur(blur(ink, r), r);
  // line roles (2026-10-27): thick outlines survive an erosion of the ink, thin lines (hatching, details) do not
  const morph = (src, rr, op) => { const t = new Float32Array(N), o = new Float32Array(N);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let v = op(); for (let dx = -rr; dx <= rr; dx++) v = op(v, src[y * W + Math.min(W - 1, Math.max(0, x + dx))]); t[y * W + x] = v; }
    for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) { let v = op(); for (let dy = -rr; dy <= rr; dy++) v = op(v, t[Math.min(H - 1, Math.max(0, y + dy)) * W + x]); o[y * W + x] = v; }
    return o; };
  const MIN = (a, b) => a === undefined ? 1 : Math.min(a, b), MAX = (a, b) => a === undefined ? 0 : Math.max(a, b);
  const rr = Math.max(1, Math.round(W / 230)), thick = morph(morph(ink, rr, MIN), rr + 1, MAX);
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  // two colour families: brass gold on the lit side, red-brown in the shade; outlines stay a deep sepia frame
  const OUT_L = [58, 36, 18], OUT_D = [31, 18, 8], HAT_L = [168, 128, 62], HAT_D = [122, 63, 34], DET_L = [196, 154, 82], DET_D = [107, 74, 42];
  // 'iri' (2026-10-28): the New Style openers' colours — grey-brown outlines, hatching in a pale rainbow that runs along the light
  // (lavender → rose → sky → gold, low chroma over a pewter grey), a few small gold glints on the lit outline; fills stay white
  const IO_L = [92, 72, 66], IO_D = [40, 30, 32], PEW_L = [150, 132, 128], PEW_D = [104, 88, 96];
  const RAIN = [[164, 124, 210], [226, 132, 170], [112, 162, 226], [222, 170, 82]];
  const rain = t => { t = ((t % 1) + 1) % 1 * RAIN.length; const a = Math.floor(t), b = (a + 1) % RAIN.length; return mix(RAIN[a], RAIN[b], t - a); };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, k = ink[i]; if (k < .02) continue; // paper-white fills and the transparent ground stay exactly as drawn
    const lit = Math.min(1, Math.max(0, (x / W) * 0.55 + (y / H) * 0.45 + (D[i] * 2.4 - .3) * .5)); // light from the upper left, deeper where hatched
    const isOut = Math.min(1, thick[i] * 1.6), dense = Math.min(1, D[i] * 3);
    let lc;
    if (STYLE === 'iri') {
      const hue = rain((x + y) / (W + H) * 1.6), thinC = mix(mix(PEW_L, hue, .85 * (1 - lit * .45)), PEW_D, lit * .45);
      lc = mix(thinC, mix(mix(IO_L, hue, .22 * (1 - lit)), IO_D, lit), isOut); // the lit outline catches a little of the rainbow too
    } else {
      const thin = mix(mix(DET_L, DET_D, lit), mix(HAT_L, HAT_D, lit), dense); // sparse thin lines = details, dense = hatching
      lc = mix(thin, mix(OUT_L, OUT_D, lit), isOut);
    }
    const col = mix(lc, [255, 255, 255], 1 - k); // a half-tone pixel stays half-way between the white fill and its ink
    p[i * 4] = col[0]; p[i * 4 + 1] = col[1]; p[i * 4 + 2] = col[2];
  }
  g.putImageData(d, 0, 0);
  if (STYLE === 'iri' && GLINTS) { // glints (off since 2026-10-28, per direction): up to five on the lit outline, a small gold star
    const cand = []; for (let y = 2; y < H - 2; y += 2) for (let x = 2; x < W - 2; x += 2) { const i = y * W + x; if (thick[i] > .5 && ink[i] > .5) cand.push([x, y, (1 - x / W) + (1 - y / H)]); }
    cand.sort((a, b) => b[2] - a[2]); const pick = [], gap = Math.max(W, H) * .18;
    for (const c2 of cand) { if (pick.length >= 5) break; if (pick.every(q => Math.hypot(q[0] - c2[0], q[1] - c2[1]) > gap)) pick.push(c2); }
    const star = (x, y, s, col) => { g.fillStyle = col; g.beginPath(); g.moveTo(x, y - s); g.quadraticCurveTo(x + s * .15, y - s * .15, x + s, y); g.quadraticCurveTo(x + s * .15, y + s * .15, x, y + s);
      g.quadraticCurveTo(x - s * .15, y + s * .15, x - s, y); g.quadraticCurveTo(x - s * .15, y - s * .15, x, y - s); g.fill(); };
    const s = Math.max(5, W / 38);
    for (const [x, y] of pick) { star(x, y, s, 'rgba(214,162,64,.95)'); star(x, y, s * .55, 'rgba(255,246,214,1)'); } // gold rays, a bright core
  }
  if (FLAT) { g.globalCompositeOperation = 'destination-over'; g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); } // onto white: they multiply into the sheet
  return c.toDataURL('image/png').split(',')[1];
};
// size (audit 2026-10-28): every drawing but the footer flourish (drawn in the chrome SVG, no multiply) is laid on white and then
// reduced to a 256-colour palette — a PDF keeps PNGs lossless, and the tint makes every pixel a different colour (4x smaller)
const FLAT_OF = f => !/^orn-footer/.test(f);
const quantize = o => { const t = o + '.q.png';
  require('child_process').execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', o, '-filter_complex', '[0]split[a][b];[a]palettegen=max_colors=256:stats_mode=full[p];[b][p]paletteuse=dither=none', t]);
  if (fs.statSync(t).size < fs.statSync(o).size) fs.renameSync(t, o); else fs.unlinkSync(t); };
// options (2026-10-28): STYLE=iri (default since 2026-10-28, the New Style colours) or warm (the earlier brass / red-brown); ONLY=a.svg,b.png to render just those; SUFFIX for the output name
const STYLE = process.env.STYLE || 'iri', ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null, SUFFIX = process.env.SUFFIX || '.tint.png';
const STYLE_OF = f => /^(toc-compass|orn-footer)/.test(f) && !process.env.STYLE ? 'warm' : STYLE; // the สารบัญ compass and the footer flourish keep the warm inks (2026-10-28)
(async () => {
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'tint-'));
  const ch = spawn(CH, ['--headless=new', '--remote-debugging-port=' + DBG, '--user-data-dir=' + prof, 'about:blank']);
  let tabs; for (let i = 0; i < 40; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${DBG}/json`)).json(); break; } catch { await sleep(250); } }
  const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
  let id = 0; const pend = {}; ws.onmessage = e => { const m = JSON.parse(e.data); if (pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } };
  const cmd = (method, params = {}) => new Promise(r => { pend[++id] = r; ws.send(JSON.stringify({ id, method, params })); });
  await cmd('Page.enable'); await cmd('Page.navigate', { url: `http://localhost:${PORT}/assets/` + FILES[0] }); await sleep(1500);
  let tot = 0;
  for (const f of FILES.filter(f => !ONLY || ONLY.includes(f))) {
    const r = await cmd('Runtime.evaluate', { expression: `(${TINT})('/assets/${f}',${W_OF(f)},${JSON.stringify(STYLE_OF(f))},${!!process.env.GLINTS},${FLAT_OF(f)})`, awaitPromise: true, returnByValue: true });
    if (!r.result || r.result.type !== 'string') { console.log(f, 'failed', JSON.stringify(r).slice(0, 200)); continue; }
    const o = path.join(A, f.replace(/\.(svg|png)$/, SUFFIX)); fs.writeFileSync(o, Buffer.from(r.result.value, 'base64')); if (FLAT_OF(f)) quantize(o); tot += fs.statSync(o).size;
  }
  console.log(FILES.length + ' tinted, ' + Math.round(tot / 1024) + ' KB');
  ws.close(); ch.kill();
})();
