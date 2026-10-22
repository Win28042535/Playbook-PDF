// Ink DNA pass (2026-10-22): rewrites the engraved line drawings (assets/eng-*.svg, assets/ill-*.svg) in the hand-inked style
// measured off the supplied compass (see ILLUSTRATION-DNA.md):
//   - ink: pure black at full opacity (was #111318 at .78 group opacity);
//   - three weights, as a share of the drawing's width: heavy 1.2% (was ≥1.3 on a 240 box), main 0.5%, fine 0.32%;
//     each line varies a little (±12%) so it reads as drawn, not plotted;
//   - light hatching (stroke-opacity ≤ .6) keeps every other line at full ink instead of being grey; dense shade stays whole;
//   - the hatched ground ellipse under each piece is dropped;
//   - a small, seeded wobble on every absolute coordinate (hatch lines become slight curves).
// Paper fills (#fafafc) stay: they hide what lies behind a form, and the page multiplies them away.
// usage: node tools/ink-dna.js <file.svg>...   (rewrites in place; run on the generator output, not twice on the same file)
const fs = require('fs');

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function hash(str) { let h = 2166136261; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }
const r1 = n => Math.round(n * 100) / 100;

function inkDNA(svg, name) {
  const vb = svg.match(/viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"/), W = +vb[3], H = +vb[4], Y0 = +vb[2];
  const rnd = rng(hash(name)), jit = W * 0.0011; // ≈ 0.26 units on a 240 box
  const HEAVY = W * 0.012, MAIN = W * 0.005, FINE = W * 0.0032;

  // 1. drop the ground: a clip that is a single flat ellipse in the bottom fifth, and the hatch group that uses it
  const ground = [], isGround = (cy, rx, ry) => cy > Y0 + H * 0.8 && ry < H * 0.09 && rx > ry * 3;
  svg.replace(/<clipPath id="(\w+)"><path d="M([-\d.]+) ([-\d.]+)a([\d.]+) ([\d.]+) 0 1 0 [-\d.]+ 0a[\d.]+ [\d.]+ 0 1 0 [-\d.]+ 0Z"[^>]*\/><\/clipPath>/g,
    (m, id, x, y, rx, ry) => { if (isGround(+y, +rx, +ry)) ground.push(id); return m; });
  svg.replace(/<clipPath id="(\w+)"><ellipse cx="[-\d.]+" cy="([-\d.]+)" rx="([\d.]+)" ry="([\d.]+)"\/><\/clipPath>/g,
    (m, id, cy, rx, ry) => { if (isGround(+cy, +rx, +ry)) ground.push(id); return m; });
  for (const id of ground) { // remove the whole group that uses the ground clip, nested groups included
    const open = `<g clip-path="url(#${id})">`, a = svg.indexOf(open); if (a < 0) continue;
    let i = a + open.length, depth = 1;
    while (depth && i < svg.length) { const o = svg.indexOf('<g', i), c = svg.indexOf('</g>', i); if (c < 0) break; if (o >= 0 && o < c) { depth++; i = o + 2; } else { depth--; i = c + 4; } }
    svg = svg.slice(0, a) + svg.slice(i);
  }

  // 2. ink colour and group opacity
  svg = svg.replace(/stroke="#111318"/g, 'stroke="#000"').replace(/(<g fill="none" stroke="#000") stroke-opacity="[\d.]+"/, '$1');

  // 3. light hatching: inside each clip group, if its lines are light (opacity ≤ .6) keep every other one
  svg = svg.replace(/(<g clip-path="url\(#\w+\)">)((?:<path [^>]*\/>)+)(<\/g>)/g, (m, a, body, z) => { // innermost hatch groups only
    const lines = body.match(/<path [^>]*\/>/g) || [];
    const light = lines.length > 3 && lines.every(l => +((l.match(/stroke-opacity="([\d.]+)"/) || [])[1] || 1) <= 0.6);
    return a + (light ? lines.filter((_, i) => i % 2 === 0).join('') : body) + z;
  });

  // 4. weights + opacity per path
  svg = svg.replace(/stroke-width="([\d.]+)"(\s*stroke-opacity="[\d.]+")?/g, (m, w) => {
    w = +w; const base = w >= 1.3 ? HEAVY : w >= 0.85 ? MAIN : FINE;
    return `stroke-width="${r1(base * (0.88 + rnd() * 0.24))}"`;
  });

  // 5. wobble: nudge absolute coordinates of M/L/Q/C/T/S/H/V commands; straight hatch lines become a gentle curve
  svg = svg.replace(/ d="([^"]+)"/g, (m, d) => {
    const hl = d.match(/^M([-\d.]+) ([-\d.]+)L([-\d.]+) ([-\d.]+)$/);
    if (hl) { const [x1, y1, x2, y2] = hl.slice(1).map(Number), b = (rnd() - 0.5) * jit * 2.2, len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const mx = (x1 + x2) / 2 - (y2 - y1) / len * b, my = (y1 + y2) / 2 + (x2 - x1) / len * b;
      return ` d="M${r1(x1 + (rnd() - .5) * jit)} ${r1(y1 + (rnd() - .5) * jit)}Q${r1(mx)} ${r1(my)} ${r1(x2 + (rnd() - .5) * jit)} ${r1(y2 + (rnd() - .5) * jit)}"`; }
    let out = '', cmd = '';
    for (const t of d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g) || []) {
      if (/[A-Za-z]/.test(t)) { cmd = t; out += t; continue; }
      const jiggle = 'MLQCTSHV'.includes(cmd); // absolute point commands only; arcs and relative commands untouched
      out += (/[\d.]$/.test(out) ? ' ' : '') + (jiggle ? r1(+t + (rnd() - .5) * jit) : t);
    }
    return ` d="${out}"`;
  });
  return svg;
}

for (const f of process.argv.slice(2)) {
  const src = fs.readFileSync(f, 'utf8');
  if (src.includes('data-ink="dna"')) { console.log('skip (already inked)', f); continue; }
  const out = inkDNA(src, f.split(/[\\/]/).pop()).replace('<svg ', '<svg data-ink="dna" ');
  fs.writeFileSync(f, out);
  console.log(f, (src.length / 1024).toFixed(0) + ' → ' + (out.length / 1024).toFixed(0) + ' KB');
}
