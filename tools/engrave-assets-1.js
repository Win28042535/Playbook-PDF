// Engraving-style line drawings for the "เจาะรายสินทรัพย์" sheet (same recipe as assets/ill-*.svg:
// near-black ink, outlines 1.1-1.6, hatching 0.4-0.5 clipped to faces, light from the upper left).
const fs = require('fs');
const OUT = process.argv[2];
const f = n => +n.toFixed(1);
function Doc(w, h) {
  let defs = [], body = [], id = 0;
  const d = {
    clip(pathD) { const k = 'c' + (id++); defs.push(`<clipPath id="${k}"><path d="${pathD}"/></clipPath>`); return k; },
    raw(s) { body.push(s); },
    path(pd, w = 1.2, o = .85) { body.push(`<path d="${pd}" stroke-width="${w}" stroke-opacity="${o}"/>`); },
    // parallel lines at angle (deg) across bbox, clipped
    hatch(clipD, box, ang, gap, w = .45, o = .8) {
      const k = d.clip(clipD), [x0, y0, x1, y1] = box, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      const R = Math.hypot(x1 - x0, y1 - y0) / 2 + 2, a = ang * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
      let s = `<g clip-path="url(#${k})">`;
      for (let t = -R; t <= R; t += gap) {
        const px = cx + nx * t, py = cy + ny * t;
        s += `<path d="M${f(px - ux * R)} ${f(py - uy * R)}L${f(px + ux * R)} ${f(py + uy * R)}" stroke-width="${w}" stroke-opacity="${o}"/>`;
      }
      body.push(s + '</g>');
    },
    out(file) {
      fs.writeFileSync(file, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs>${defs.join('')}</defs><g fill="none" stroke="#111318" stroke-opacity=".78" stroke-linecap="round" stroke-linejoin="round">${body.join('')}</g></svg>`);
    }
  };
  return d;
}
const poly = pts => 'M' + pts.map(p => f(p[0]) + ' ' + f(p[1])).join('L') + 'Z';
const ell = (cx, cy, rx, ry) => `M${f(cx - rx)} ${f(cy)}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;
function ground(d, cx, cy, rx, ry) { d.hatch(ell(cx, cy, rx, ry), [cx - rx, cy - ry, cx + rx, cy + ry], 62, 3.2, .45, .55); }

/* ── gold: three bars in a pyramid ── */
function bar(d, x, y, w = 92, h = 26, dx = 18, dy = -13, ins = 9) {
  const front = [[x, y + h], [x + w, y + h], [x + w - ins, y], [x + ins, y]];
  const top = [[x + ins, y], [x + w - ins, y], [x + w - ins + dx, y + dy], [x + ins + dx, y + dy]];
  const side = [[x + w, y + h], [x + w + dx, y + h + dy], [x + w - ins + dx, y + dy], [x + w - ins, y]];
  [front, top, side].forEach(q => d.raw(`<path d="${poly(q)}" fill="#fafafc" stroke="none"/>`)); // occlude what lies behind
  d.hatch(poly(top), [x, y + dy, x + w + dx, y], 0, 6, .4, .5);
  d.hatch(poly(front), [x, y, x + w, y + h], 0, 2.6, .45, .8);
  d.hatch(poly(side), [x + w - ins, y + dy, x + w + dx, y + h], 62, 2.2, .45, .85);
  d.hatch(poly(side), [x + w - ins, y + dy, x + w + dx, y + h], -30, 3, .4, .6);
  // stamp on the front face
  d.path(poly([[x + w / 2 - 22, y + 7], [x + w / 2 + 22, y + 7], [x + w / 2 + 20, y + h - 6], [x + w / 2 - 20, y + h - 6]]), .7, .75);
  d.path(`M${f(x + w / 2 - 14)} ${f(y + 13)}H${f(x + w / 2 + 14)}M${f(x + w / 2 - 10)} ${f(y + 17)}H${f(x + w / 2 + 10)}`, .6, .7);
  [front, top, side].forEach(p => d.path(poly(p), 1.3, .9));
}
function gold() {
  const d = Doc(240, 228);
  ground(d, 124, 196, 104, 13);
  bar(d, 20, 158); bar(d, 112, 158);
  bar(d, 66, 119);
  d.out(OUT + '/eng-gold.svg');
}

/* ── Thai stocks: a stone stela carved with a rising candlestick chart ── */
function stocks() {
  const d = Doc(240, 228);
  ground(d, 124, 206, 100, 12);
  const X0 = 46, X1 = 176, Y0 = 46, Y1 = 204, R = 30, DX = 14, DY = -10;
  const face = `M${X0} ${Y1}V${Y0 + R}Q${X0} ${Y0} ${X0 + R} ${Y0}H${X1 - R}Q${X1} ${Y0} ${X1} ${Y0 + R}V${Y1}Z`;
  const side = `M${X1} ${Y1}L${X1 + DX} ${Y1 + DY}V${Y0 + R + DY}Q${X1 + DX} ${Y0 + DY} ${X1 - R + DX} ${Y0 + DY}L${X1 - R} ${Y0}Q${X1} ${Y0} ${X1} ${Y0 + R}Z`;
  d.hatch(side, [X1 - R, Y0 + DY, X1 + DX, Y1], 75, 2.2, .45, .85);
  d.hatch(side, [X1 - R, Y0 + DY, X1 + DX, Y1], -20, 3.2, .4, .55);
  d.hatch(`M${X0} ${Y1}V${Y0 + R}Q${X0} ${Y0} ${X0 + R} ${Y0}H${X0 + R + 4}Q${X0 + 16} ${Y0 + 6} ${X0 + 16} ${Y0 + R + 8}V${Y1}Z`, [X0, Y0, X0 + R + 4, Y1], 90, 3, .4, .55); // a little shade at the left edge of the face
  d.path(face, 1.4, .9); d.path(side, 1.2, .85);
  // carved frame + base line
  d.path(`M${X0 + 12} ${Y1 - 14}V${Y0 + R + 6}Q${X0 + 12} ${Y0 + 12} ${X0 + R + 6} ${Y0 + 12}H${X1 - R - 6}Q${X1 - 12} ${Y0 + 12} ${X1 - 12} ${Y0 + R + 6}V${Y1 - 14}Z`, .6, .7);
  for (let gy = 0; gy < 4; gy++) d.path(`M${X0 + 18} ${f(Y1 - 30 - gy * 30)}H${X1 - 18}`, .35, .45);
  // candles: rising with a dip
  const C = [[0, 150, 168, 145, 176], [1, 140, 156, 132, 162], [2, 146, 160, 140, 166], [3, 122, 140, 114, 146], [4, 104, 124, 96, 130], [5, 84, 104, 74, 110]];
  C.forEach(([i, top, bot, hi, lo]) => {
    const cx = X0 + 30 + i * 16, w = 8;
    d.path(`M${f(cx)} ${hi}V${top}M${f(cx)} ${bot}V${lo}`, .9, .85);
    const body = poly([[cx - w / 2, top], [cx + w / 2, top], [cx + w / 2, bot], [cx - w / 2, bot]]);
    if (i !== 2) d.hatch(body, [cx - w / 2, top, cx + w / 2, bot], 90, 1.6, .45, .85);
    d.path(body, 1, .9);
  });
  // trend line with arrow
  d.path(`M${X0 + 22} 182L${X0 + 52} 164L${X0 + 66} 170L${X0 + 98} 124L${X0 + 112} 100`, .8, .7);
  d.path(`M${X0 + 103} 101L${X0 + 113} 97L${X0 + 113} 108`, .9, .8);
  d.out(OUT + '/eng-stockth.svg');
}

/* ── mutual fund: a woven basket holding many different coins ── */
function coin(d, cx, cy, rx, ry, mark) {
  const th = 4;
  const edge = `M${f(cx - rx)} ${f(cy)}A${rx} ${ry} 0 0 0 ${f(cx + rx)} ${f(cy)}V${f(cy + th)}A${rx} ${ry} 0 0 1 ${f(cx - rx)} ${f(cy + th)}Z`;
  d.hatch(edge, [cx - rx, cy, cx + rx, cy + ry + th], 90, 1.4, .45, .8);
  d.path(edge, 1, .9);
  d.path(ell(cx, cy, rx, ry), 1.1, .9);
  d.path(ell(cx, cy, rx * .78, ry * .78), .5, .6);
  d.hatch(`M${f(cx)} ${f(cy - ry)}A${rx} ${ry} 0 0 1 ${f(cx + rx)} ${f(cy)}A${rx} ${ry} 0 0 1 ${f(cx)} ${f(cy + ry)}A${rx * .78} ${ry * .78} 0 0 0 ${f(cx)} ${f(cy - ry)}Z`, [cx, cy - ry, cx + rx, cy + ry], 30, 2.2, .4, .55);
  if (mark === 'star') { let p = []; for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? rx * .18 : rx * .42; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * ry / rx]); } d.path(poly(p), .7, .8); }
  if (mark === 'ring') d.path(ell(cx, cy, rx * .3, ry * .3), .8, .8);
  if (mark === 'bar') d.path(`M${f(cx - rx * .35)} ${f(cy)}H${f(cx + rx * .35)}M${f(cx)} ${f(cy - ry * .4)}V${f(cy + ry * .4)}`, .8, .8);
}
function fund() {
  const d = Doc(240, 228);
  ground(d, 122, 206, 98, 12);
  const L = 40, Rr = 204, T = 118, B = 200, bl = 66, br = 178;
  // coins first (behind the rim front), piled
  coin(d, 96, 108, 26, 9, 'star'); coin(d, 142, 104, 24, 8, 'ring'); coin(d, 120, 94, 25, 9, 'bar');
  coin(d, 72, 116, 20, 7, 'ring'); coin(d, 166, 114, 21, 7, 'star'); coin(d, 128, 78, 20, 7, 'star');
  // basket body
  const body = `M${L} ${T}Q${L + 4} ${B - 10} ${bl} ${B}H${br}Q${Rr - 4} ${B - 10} ${Rr} ${T}A82 14 0 0 1 ${L} ${T}Z`;
  d.raw(`<path d="${body}" fill="#fafafc" stroke="none"/>`);
  // weave: vertical ribs + alternating short arcs
  const ribs = 11;
  for (let i = 0; i <= ribs; i++) {
    const t = i / ribs, xt = L + (Rr - L) * t, xb = bl + (br - bl) * t;
    d.path(`M${f(xt)} ${f(T + 12 * Math.sin(Math.PI * t))}L${f(xb)} ${B}`, .7, .75);
  }
  for (let r = 0; r < 6; r++) {
    const yy = T + 14 + r * 12;
    for (let i = 0; i < ribs; i++) {
      if ((i + r) % 2) continue;
      const t0 = i / ribs, t1 = (i + 1) / ribs, k = (yy - T) / (B - T);
      const xa = L + (bl - L) * k + ((Rr + (br - Rr) * k) - (L + (bl - L) * k)) * t0, xb2 = L + (bl - L) * k + ((Rr + (br - Rr) * k) - (L + (bl - L) * k)) * t1;
      const seg = `M${f(xa)} ${f(yy)}Q${f((xa + xb2) / 2)} ${f(yy + 5)} ${f(xb2)} ${f(yy)}`;
      d.path(seg, .9, .8);
    }
  }
  // shade the right side of the basket
  d.hatch(`M${(L + Rr) / 2 + 30} ${T}H${Rr}Q${Rr - 4} ${B - 10} ${br} ${B}H${(bl + br) / 2 + 22}Z`, [120, T, Rr, B], 70, 2.6, .4, .6);
  d.path(body, 1.4, .9);
  d.path(`M${L} ${T}A82 14 0 0 0 ${Rr} ${T}`, 1.3, .9); // rim front
  d.path(`M${L + 2} ${T + 5}A80 13 0 0 0 ${Rr - 2} ${T + 5}`, .6, .7);
  d.out(OUT + '/eng-fund.svg');
}
gold(); stocks(); fund();
console.log('ok');
