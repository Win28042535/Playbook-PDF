// Batch 3 of the engraved drawings: the six library category headers (same recipe as engrave-assets-1/2.js).
// Drawn a little bolder (thicker outlines, wider hatching) because they print at ~60px.
const fs = require('fs');
const OUT = process.argv[2];
const f = n => +(+n).toFixed(1);
const PAPER = '#fafafc';
function Doc(w, h) {
  let defs = [], body = [], id = 0;
  const d = {
    clip(pathD) { const k = 'c' + (id++); defs.push(`<clipPath id="${k}"><path d="${pathD}" clip-rule="evenodd"/></clipPath>`); return k; },
    raw(s) { body.push(s); },
    fill(pd) { body.push(`<path d="${pd}" fill="${PAPER}" stroke="none"/>`); },
    path(pd, w = 1.2, o = .85) { body.push(`<path d="${pd}" stroke-width="${w}" stroke-opacity="${o}"/>`); },
    hatch(clipD, box, ang, gap, w = .45, o = .8) {
      const two = Array.isArray(clipD), k = d.clip(two ? clipD[1] : clipD), ko = two ? d.clip(clipD[0]) : null, [x0, y0, x1, y1] = box, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      const R = Math.hypot(x1 - x0, y1 - y0) / 2 + 2, a = ang * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
      let s = (ko ? `<g clip-path="url(#${ko})">` : '') + `<g clip-path="url(#${k})">`;
      for (let t = -R; t <= R; t += gap) {
        const px = cx + nx * t, py = cy + ny * t;
        s += `<path d="M${f(px - ux * R)} ${f(py - uy * R)}L${f(px + ux * R)} ${f(py + uy * R)}" stroke-width="${w}" stroke-opacity="${o}"/>`;
      }
      body.push(s + '</g>' + (ko ? '</g>' : ''));
    },
    out(name) {
      fs.writeFileSync(OUT + '/' + name, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs>${defs.join('')}</defs><g fill="none" stroke="#111318" stroke-opacity=".78" stroke-linecap="round" stroke-linejoin="round">${body.join('')}</g></svg>`);
    }
  };
  return d;
}
const poly = pts => 'M' + pts.map(p => f(p[0]) + ' ' + f(p[1])).join('L') + 'Z';
const ell = (cx, cy, rx, ry) => `M${f(cx - rx)} ${f(cy)}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;
const circ = (cx, cy, r) => ell(cx, cy, r, r);
function ground(d, cx, cy, rx, ry) { d.hatch(ell(cx, cy, rx, ry), [cx - rx, cy - ry, cx + rx, cy + ry], 62, 3.2, .45, .55); }
// the shaded (right/lower) crescent of a disc: the disc minus the same disc shifted up-left
const crescent = (cx, cy, r) => [circ(cx, cy, r), circ(cx, cy, r) + circ(cx - r * .42, cy - r * .42, r)]; // [outer clip, even-odd XOR]: the disc minus the same disc moved up-left
function coinFace(d, cx, cy, rx, ry, th) {
  const edge = `M${f(cx - rx)} ${f(cy)}A${rx} ${ry} 0 0 0 ${f(cx + rx)} ${f(cy)}V${f(cy + th)}A${rx} ${ry} 0 0 1 ${f(cx - rx)} ${f(cy + th)}Z`;
  d.fill(edge); d.fill(ell(cx, cy, rx, ry));
  d.hatch(edge, [cx - rx, cy, cx + rx, cy + ry + th], 90, 1.4, .45, .8);
  d.path(edge, 1, .9); d.path(ell(cx, cy, rx, ry), 1.1, .9);
}


/* 1 basics: an open book with a compass lying on the right page */
function basics() {
  const d = Doc(240, 228);
  ground(d, 120, 196, 100, 10);
  const lp = `M120 188Q88 176 22 184L30 74Q86 66 120 82Z`, rp = `M120 188Q152 176 218 184L210 74Q154 66 120 82Z`;
  d.fill(lp); d.fill(rp);
  d.hatch(`M120 188Q88 176 22 184L24 160Q86 152 120 166Z`, [20, 150, 122, 190], 0, 3, .5, .6);
  for (let i = 0; i < 6; i++) d.path(`M40 ${96 + i * 13}Q80 ${90 + i * 13} 108 ${100 + i * 13}`, .7, .6);
  d.path(lp, 1.8, .9); d.path(rp, 1.8, .9); d.path('M120 82V188', 1.4, .85);
  d.path('M22 184L18 192Q86 184 120 196Q154 184 222 192L218 184', 1.4, .85);
  const cx = 166, cy = 128, r = 34;
  d.fill(circ(cx, cy, r)); d.hatch(crescent(cx, cy, r), [cx - r, cy - r, cx + r, cy + r], 45, 2.6, .5, .8);
  d.path(circ(cx, cy, r), 1.8, .9); d.path(circ(cx, cy, r - 6), .8, .75);
  d.path(poly([[cx, cy - 26], [cx + 6, cy], [cx, cy + 26], [cx - 6, cy]]), 1.3, .9);
  d.hatch(poly([[cx, cy - 26], [cx + 6, cy], [cx - 6, cy]]), [cx - 6, cy - 26, cx + 6, cy], 90, 1.6, .5, .9);
  d.path(poly([[cx - 26, cy], [cx, cy - 5], [cx + 26, cy], [cx, cy + 5]]), 1, .8);
  d.path(`M${cx} ${cy - r}V${cy - r - 8}`, 2, .85); d.path(circ(cx, cy - r - 11, 4), 1.2, .85);
  d.out('eng-cat-basics.svg');
}
/* 2 asset types: four different solids grouped together */
function solids() {
  const d = Doc(240, 228);
  ground(d, 120, 198, 104, 11);
  const x = 30, y = 112, s = 62, dx = 22, dy = -16;
  const fr = poly([[x, y + s], [x + s, y + s], [x + s, y], [x, y]]), tp = poly([[x, y], [x + s, y], [x + s + dx, y + dy], [x + dx, y + dy]]), sd = poly([[x + s, y + s], [x + s + dx, y + s + dy], [x + s + dx, y + dy], [x + s, y]]);
  [fr, tp, sd].forEach(p => d.fill(p));
  d.hatch(fr, [x, y, x + s, y + s], 0, 3.4, .5, .55); d.hatch(sd, [x + s, y + dy, x + s + dx, y + s], 75, 2.2, .5, .85);
  [fr, tp, sd].forEach(p => d.path(p, 1.7, .9));
  const px = 150, py = 176;
  const pf = poly([[px, py], [px + 64, py], [px + 34, py - 96]]), ps = poly([[px + 64, py], [px + 84, py - 14], [px + 34, py - 96]]);
  d.fill(pf); d.fill(ps); d.hatch(ps, [px + 34, py - 96, px + 84, py], 70, 2.2, .5, .85); d.hatch(pf, [px, py - 96, px + 64, py], 0, 4, .45, .45);
  d.path(pf, 1.7, .9); d.path(ps, 1.7, .9);
  const cx = 118, top = 136, bot = 190, rx = 28, ry = 9;
  const body = `M${cx - rx} ${top}V${bot}A${rx} ${ry} 0 0 0 ${cx + rx} ${bot}V${top}Z`;
  d.fill(body); d.fill(ell(cx, top, rx, ry));
  d.hatch(`M${cx + 6} ${top}V${bot + 8}H${cx + rx}V${top}Z`, [cx, top, cx + rx, bot + ry], 90, 1.8, .5, .85);
  d.path(body, 1.7, .9); d.path(ell(cx, top, rx, ry), 1.7, .9);
  const sx = 64, sy = 178, sr = 22;
  d.fill(circ(sx, sy, sr)); d.hatch(crescent(sx, sy, sr), [sx - sr, sy - sr, sx + sr, sy + sr], 45, 2.2, .5, .85); d.path(circ(sx, sy, sr), 1.7, .9);
  d.out('eng-cat-assets.svg');
}
/* 3 cost & return: a tall and a short stack of coins, a price tag tied to the tall one */
function costs() {
  const d = Doc(240, 228);
  ground(d, 120, 198, 96, 10);
  const stack = (cx, n, rx) => { for (let i = 0; i < n; i++) coinFace(d, cx, 188 - i * 12 - 8, rx, rx * .32, 8); d.path(ell(cx, 188 - (n - 1) * 12 - 8, rx * .6, rx * .19), .9, .8); };
  stack(150, 9, 34); stack(76, 4, 30);
  const tx = 50, ty = 52;
  const tag = poly([[tx, ty], [tx + 52, ty - 10], [tx + 62, ty + 8], [tx + 58, ty + 34], [tx + 6, ty + 44]]);
  d.fill(tag); d.hatch(tag, [tx, ty - 10, tx + 62, ty + 44], -10, 3.2, .45, .45); d.path(tag, 1.6, .9);
  d.path(circ(tx + 52, ty + 8, 3.5), 1.2, .85);
  d.path(`M${tx + 55} ${ty + 6}Q${tx + 90} ${ty - 6} 128 ${188 - 8 * 12 - 12}`, 1, .8);
  d.path(`M${tx + 18} ${ty + 30}L${tx + 38} ${ty + 6}`, 1.6, .85); d.path(circ(tx + 18, ty + 12, 4.5), 1.4, .85); d.path(circ(tx + 38, ty + 26, 4.5), 1.4, .85);
  d.out('eng-cat-costs.svg');
}
/* 4 scams & protection: a shield with a keyhole */
function shield() {
  const d = Doc(240, 228), cx = 120;
  ground(d, 120, 204, 74, 9);
  const S = `M${cx} 22Q${cx + 44} 40 ${cx + 76} 36Q${cx + 80} 120 ${cx} 196Q${cx - 80} 120 ${cx - 76} 36Q${cx - 44} 40 ${cx} 22Z`;
  const half = `M${cx} 22Q${cx + 44} 40 ${cx + 76} 36Q${cx + 80} 120 ${cx} 196Z`;
  d.fill(S); d.hatch(half, [cx, 22, cx + 80, 196], 60, 2.4, .5, .85);
  d.path(S, 2, .9);
  d.path(`M${cx} 36Q${cx + 38} 52 ${cx + 62} 48Q${cx + 64} 118 ${cx} 180Q${cx - 64} 118 ${cx - 62} 48Q${cx - 38} 52 ${cx} 36Z`, 1, .8);
  const k = `M${cx} 82a16 16 0 0 1 9 29l7 34h-32l7-34a16 16 0 0 1 9-29Z`;
  d.fill(k); d.hatch(k, [cx - 18, 80, cx + 18, 146], 90, 1.6, .5, .95); d.path(k, 1.6, .95);
  d.out('eng-cat-scams.svg');
}
/* 5 life planning & financial health: a wall calendar with a heart stamped on it */
function calendar() {
  const d = Doc(240, 228);
  ground(d, 120, 204, 92, 9);
  const L = 36, R = 204, T = 46, B = 194;
  const pg = poly([[L, B], [R, B], [R, T], [L, T]]); d.fill(pg); d.path(pg, 1.8, .9);
  const hd = poly([[L, T + 30], [R, T + 30], [R, T], [L, T]]); d.hatch(hd, [L, T, R, T + 30], 0, 2.2, .5, .85); d.path(hd, 1.4, .9);
  [70, 120, 170].forEach(x => { d.path(`M${x} ${T - 14}V${T + 8}`, 3, .85); d.path(circ(x, T + 10, 3), 1, .85); });
  for (let c = 1; c < 7; c++) d.path(`M${f(L + c * (R - L) / 7)} ${T + 30}V${B}`, .6, .55);
  for (let r = 1; r < 5; r++) d.path(`M${L} ${f(T + 30 + r * (B - T - 30) / 5)}H${R}`, .6, .55);
  const cx = 132, cy = 130;
  const H = `M${cx} ${cy + 38}C${cx - 10} ${cy + 28} ${cx - 42} ${cy + 8} ${cx - 42} ${cy - 12}C${cx - 42} ${cy - 26} ${cx - 30} ${cy - 34} ${cx - 20} ${cy - 34}C${cx - 10} ${cy - 34} ${cx - 3} ${cy - 28} ${cx} ${cy - 20}C${cx + 3} ${cy - 28} ${cx + 10} ${cy - 34} ${cx + 20} ${cy - 34}C${cx + 30} ${cy - 34} ${cx + 42} ${cy - 26} ${cx + 42} ${cy - 12}C${cx + 42} ${cy + 8} ${cx + 10} ${cy + 28} ${cx} ${cy + 38}Z`;
  d.fill(H); d.hatch(H, [cx - 42, cy - 34, cx + 42, cy + 38], -40, 2, .5, .9); d.path(H, 1.8, .95);
  d.out('eng-cat-planning.svg');
}
/* 6 risk & reading yourself: an upright hand mirror (oval glass, turned handle) showing an eye */
function mirror() {
  const d = Doc(240, 228), cx = 120, cy = 88, rx = 52, ry = 62;
  ground(d, 120, 210, 52, 7);
  const handle = `M${cx - 7} ${cy + ry + 6}Q${cx - 14} ${cy + ry + 30} ${cx - 9} ${cy + ry + 52}L${cx - 12} 204H${cx + 12}L${cx + 9} ${cy + ry + 52}Q${cx + 14} ${cy + ry + 30} ${cx + 7} ${cy + ry + 6}Z`;
  d.fill(handle); d.hatch(`M${cx + 1} ${cy + ry + 6}H${cx + 14}V204H${cx + 1}Z`, [cx, cy + ry, cx + 14, 204], 90, 1.6, .5, .85); d.path(handle, 1.6, .9);
  [cy + ry + 22, cy + ry + 52].forEach(yy => d.path(`M${cx - 12} ${yy}H${cx + 12}`, 1.4, .85));
  d.fill(ell(cx, cy, rx + 10, ry + 10));
  d.hatch([ell(cx, cy, rx + 10, ry + 10), ell(cx, cy, rx + 10, ry + 10) + ell(cx, cy, rx, ry)], [cx - rx - 10, cy - ry - 10, cx + rx + 10, cy + ry + 10], 0, 2, .5, .85);
  d.path(ell(cx, cy, rx + 10, ry + 10), 1.8, .9);
  d.raw(`<path d="${ell(cx, cy, rx, ry)}" fill="${PAPER}" stroke-width="1.3" stroke-opacity=".9"/>`);
  // scalloped crest on top
  d.path(`M${cx - 20} ${cy - ry - 8}Q${cx - 10} ${cy - ry - 24} ${cx} ${cy - ry - 12}Q${cx + 10} ${cy - ry - 24} ${cx + 20} ${cy - ry - 8}`, 1.4, .85);
  const eye = `M${cx - 36} ${cy}Q${cx} ${cy - 30} ${cx + 36} ${cy}Q${cx} ${cy + 30} ${cx - 36} ${cy}Z`;
  d.path(eye, 1.7, .9);
  d.fill(circ(cx, cy, 14)); d.hatch(circ(cx, cy, 14), [cx - 14, cy - 14, cx + 14, cy + 14], 45, 1.6, .5, .9); d.path(circ(cx, cy, 14), 1.4, .9);
  d.raw(`<path d="${circ(cx, cy, 5.5)}" fill="#111318" fill-opacity=".85" stroke="none"/><path d="${circ(cx - 5, cy - 5, 2.8)}" fill="${PAPER}" stroke="none"/>`);
  d.path(`M${cx - 34} ${cy - 40}Q${cx - 44} ${cy - 20} ${cx - 42} ${cy - 2}`, 1.6, .5);
  d.out("eng-cat-risk.svg");
}
basics(); solids(); costs(); shield(); calendar(); mirror();
console.log('ok');
