// Batch 2 of the engraved drawings: six more assets for "เจาะรายสินทรัพย์" and the six journey sides.
// Same recipe as eng.js / assets/ill-*.svg.
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

/* 1 globe on a stand (foreign stocks) */
function globe() {
  const d = Doc(240, 228), cx = 120, cy = 100, r = 70;
  ground(d, 120, 208, 70, 9);
  d.path(`M${cx - 30} 206H${cx + 30}L${cx + 22} 194H${cx - 22}Z`, 1.3, .9);
  d.hatch(`M${cx - 30} 206H${cx + 30}L${cx + 22} 194H${cx - 22}Z`, [cx - 30, 194, cx + 30, 206], 0, 2.4, .45, .8);
  d.path(`M${cx} 194V${cy + r + 8}`, 2.2, .85);
  d.path(`M${cx - r - 10} ${cy}A${r + 10} ${r + 10} 0 0 0 ${cx + r + 10} ${cy}`, 1.6, .85); // meridian ring
  d.path(`M${cx - r - 6} ${cy}A${r + 6} ${r + 6} 0 0 0 ${cx + r + 6} ${cy}`, .6, .7);
  d.fill(circ(cx, cy, r));
  d.hatch(crescent(cx, cy, r), [cx - r, cy - r, cx + r, cy + r], 55, 2.4, .45, .75);
  for (const k of [.25, .55, .85]) d.path(`M${cx} ${cy - r}A${f(r * k)} ${r} 0 0 0 ${cx} ${cy + r}A${f(r * k)} ${r} 0 0 0 ${cx} ${cy - r}`, .6, .7);
  for (const t of [-.66, -.33, 0, .33, .66]) { const yy = cy + r * t, hw = Math.sqrt(1 - t * t) * r; d.path(`M${f(cx - hw)} ${f(yy)}Q${cx} ${f(yy + 10 * Math.sqrt(1 - t * t))} ${f(cx + hw)} ${f(yy)}`, .6, .7); }
  // two land masses, lightly hatched
  const land1 = `M${cx - 50} ${cy - 30}Q${cx - 30} ${cy - 50} ${cx - 8} ${cy - 40}Q${cx + 2} ${cy - 22} ${cx - 14} ${cy - 8}Q${cx - 4} ${cy + 18} ${cx - 22} ${cy + 34}Q${cx - 40} ${cy + 20} ${cx - 44} ${cy}Q${cx - 60} ${cy - 10} ${cx - 50} ${cy - 30}Z`;
  const land2 = `M${cx + 14} ${cy - 46}Q${cx + 40} ${cy - 50} ${cx + 52} ${cy - 30}Q${cx + 44} ${cy - 12} ${cx + 30} ${cy - 14}Q${cx + 38} ${cy + 10} ${cx + 22} ${cy + 26}Q${cx + 12} ${cy + 6} ${cx + 16} ${cy - 18}Q${cx + 6} ${cy - 30} ${cx + 14} ${cy - 46}Z`;
  d.hatch(land1, [cx - 60, cy - 50, cx, cy + 34], -30, 2.2, .45, .8); d.path(land1, .9, .85);
  d.hatch(land2, [cx + 6, cy - 50, cx + 52, cy + 26], -30, 2.2, .45, .8); d.path(land2, .9, .85);
  d.path(circ(cx, cy, r), 1.5, .9);
  d.path(`M${cx} ${cy - r - 10}V${cy - r}`, 1.4, .85);
  d.out('eng-stockintl.svg');
}

/* 2 a deed rolled at both ends with a wax seal (bonds) */
function deed() {
  const d = Doc(240, 228);
  ground(d, 122, 208, 86, 10);
  const L = 62, R = 178, T = 42, B = 186;
  const sheet = poly([[L, T + 10], [R, T + 10], [R, B - 10], [L, B - 10]]);
  d.fill(sheet); d.path(sheet, 1.2, .85);
  for (let i = 0; i < 7; i++) d.path(`M${L + 18} ${T + 34 + i * 13}H${R - (i === 6 ? 60 : 18)}`, .6, .6);
  d.path(`M${L + 34} ${T + 22}H${R - 34}`, 1.3, .8);
  // the two rolls
  for (const [yy, up] of [[T, true], [B - 20, false]]) {
    const roll = `M${L - 8} ${yy + 4}H${R + 8}A6 10 0 0 1 ${R + 8} ${yy + 20}H${L - 8}A6 10 0 0 1 ${L - 8} ${yy + 4}Z`;
    d.fill(roll);
    d.hatch(roll, [L - 14, yy + 4, R + 14, yy + 20], 0, 1.8, .45, up ? .7 : .85);
    d.path(roll, 1.3, .9);
    d.path(ell(R + 8, yy + 12, 5, 8), .9, .85); d.path(ell(R + 8, yy + 12, 2, 3.5), .6, .7);
  }
  // wax seal with two ribbon tails
  const sx = R - 26, sy = B - 34;
  const tail1 = poly([[sx - 6, sy + 10], [sx - 16, sy + 44], [sx - 9, sy + 38], [sx - 2, sy + 46], [sx + 2, sy + 12]]);
  const tail2 = poly([[sx + 4, sy + 12], [sx + 10, sy + 46], [sx + 15, sy + 38], [sx + 22, sy + 44], [sx + 12, sy + 8]]);
  [tail1, tail2].forEach(t => { d.fill(t); d.hatch(t, [sx - 18, sy + 8, sx + 24, sy + 48], 80, 1.8, .45, .85); d.path(t, 1, .9); });
  let wav = ''; for (let k = 0; k <= 24; k++) { const a = k / 24 * 2 * Math.PI, rr = 22 + (k % 2 ? 2.2 : 0); wav += (k ? 'L' : 'M') + f(sx + Math.cos(a) * rr) + ' ' + f(sy + Math.sin(a) * rr); }
  d.fill(wav + 'Z'); d.hatch(wav + 'Z', [sx - 25, sy - 25, sx + 25, sy + 25], 45, 2, .45, .7); d.path(wav + 'Z', 1.2, .9);
  d.fill(circ(sx, sy, 13)); d.path(circ(sx, sy, 13), .9, .85);
  let st = []; for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? 3.6 : 8.5; st.push([sx + Math.cos(a) * rr, sy + Math.sin(a) * rr]); } d.path(poly(st), .8, .85);
  d.out('eng-bond.svg');
}

/* 3 a colonnaded building front (property / REIT) */
function building() {
  const d = Doc(240, 228);
  ground(d, 120, 208, 98, 10);
  const L = 38, R = 202;
  const steps = [[L - 8, 194, R + 8, 204], [L - 2, 184, R + 2, 194], [L + 4, 174, R - 4, 184]];
  steps.forEach(([a, b, c, e]) => { const p = poly([[a, e], [c, e], [c, b], [a, b]]); d.fill(p); d.hatch(p, [a, b, c, e], 0, 2.4, .45, .7); d.path(p, 1.1, .85); });
  const ped = poly([[L - 6, 70], [120, 30], [R + 6, 70]]); d.fill(ped); d.path(ped, 1.4, .9);
  const pin = poly([[L + 14, 64], [120, 40], [R - 14, 64]]); d.path(pin, .7, .75);
  d.hatch(pin, [L + 14, 40, R - 14, 64], 0, 3, .4, .45);
  const arch = poly([[L - 4, 70], [R + 4, 70], [R + 4, 86], [L - 4, 86]]); d.fill(arch); d.path(arch, 1.3, .9);
  d.path(`M${L - 4} 78H${R + 4}`, .6, .7);
  for (let i = 0; i < 5; i++) {
    const x = L + 6 + i * 33, w = 18, col = poly([[x, 174], [x + w, 174], [x + w, 86], [x, 86]]);
    d.fill(col);
    for (let k = 1; k < 4; k++) d.path(`M${f(x + k * w / 4)} 92V168`, .45, .6);
    d.hatch(poly([[x + w * .62, 174], [x + w, 174], [x + w, 86], [x + w * .62, 86]]), [x + w * .6, 86, x + w, 174], 90, 1.5, .45, .85);
    d.path(col, 1.1, .9);
    d.path(poly([[x - 3, 86], [x + w + 3, 86], [x + w + 3, 92], [x - 3, 92]]), .9, .85);
    d.path(poly([[x - 3, 168], [x + w + 3, 168], [x + w + 3, 174], [x - 3, 174]]), .9, .85);
  }
  d.out('eng-house.svg');
}

/* 4 a large coin with a hexagon lattice and a ₿-like mark (crypto) */
function crypto() {
  const d = Doc(240, 228), cx = 120, cy = 104, r = 74;
  ground(d, 124, 206, 76, 9);
  const rim = `M${cx - r} ${cy}A${r} ${r} 0 0 0 ${cx + r} ${cy}A${r} ${r} 0 0 0 ${cx - r} ${cy}Z`;
  // thickness at the lower right
  d.path(`M${cx + r * .7} ${cy + r * .72}A${r} ${r} 0 0 1 ${cx - r * .2} ${cy + r + 6}`, 1, .7);
  d.fill(rim);
  d.hatch(crescent(cx, cy, r), [cx - r, cy - r, cx + r, cy + r], 50, 2.2, .45, .8);
  d.path(rim, 1.6, .9); d.path(circ(cx, cy, r - 9), .8, .75);
  const k = d.clip(circ(cx, cy, r - 12)); let hx = `<g clip-path="url(#${k})">`;
  const hs = 11;
  for (let row = -8; row <= 8; row++) for (let col = -8; col <= 8; col++) {
    const x = cx + col * hs * 1.5, y = cy + row * hs * Math.sqrt(3) + (col % 2 ? hs * Math.sqrt(3) / 2 : 0);
    let p = ''; for (let j = 0; j < 6; j++) { const a = j * Math.PI / 3; p += (j ? 'L' : 'M') + f(x + Math.cos(a) * hs) + ' ' + f(y + Math.sin(a) * hs); }
    hx += `<path d="${p}Z" stroke-width=".4" stroke-opacity=".45"/>`;
  }
  d.raw(hx + '</g>');
  d.fill(circ(cx, cy, 34)); d.path(circ(cx, cy, 34), 1, .85);
  // the mark: a B with two strokes through it
  const B = `M${cx - 12} ${cy - 22}H${cx + 6}Q${cx + 18} ${cy - 22} ${cx + 18} ${cy - 11}Q${cx + 18} ${cy - 1} ${cx + 6} ${cy - 1}H${cx - 12}M${cx + 6} ${cy - 1}Q${cx + 21} ${cy - 1} ${cx + 21} ${cy + 10}Q${cx + 21} ${cy + 22} ${cx + 6} ${cy + 22}H${cx - 12}M${cx - 8} ${cy - 22}V${cy + 22}`;
  d.path(B, 2.4, .9);
  d.path(`M${cx - 3} ${cy - 29}V${cy - 22}M${cx + 5} ${cy - 29}V${cy - 22}M${cx - 3} ${cy + 22}V${cy + 29}M${cx + 5} ${cy + 22}V${cy + 29}`, 2, .9);
  d.out('eng-bitcoin.svg');
}

/* 5 a small tree whose fruit are coins (dividends) */
function coinTree() {
  const d = Doc(240, 228);
  ground(d, 120, 206, 74, 10);
  const pot = poly([[92, 206], [148, 206], [156, 170], [84, 170]]);
  d.fill(pot); d.hatch(poly([[124, 206], [148, 206], [156, 170], [128, 170]]), [124, 170, 156, 206], 75, 2.2, .45, .85); d.path(pot, 1.3, .9);
  d.path(poly([[80, 170], [160, 170], [160, 162], [80, 162]]), 1.2, .9);
  const trunk = `M114 162Q112 130 104 112Q96 96 82 88M126 162Q128 128 140 108Q150 94 166 86M118 162Q118 120 120 70`;
  d.path(trunk, 2.4, .85); d.path(`M104 112Q112 100 120 98M140 108Q132 96 120 92`, 1.4, .8);
  d.path(`M121 74Q108 64 96 66M120 82Q134 70 150 70M100 96Q88 90 72 98M142 100Q160 104 174 112`, 1, .8);
  const leaves = [[70, 82, -30], [88, 58, -10], [160, 62, 20], [184, 96, 40], [60, 104, -50]];
  leaves.forEach(([x, y, a]) => { const t = `rotate(${a} ${x} ${y})`; d.raw(`<path d="M${x - 12} ${y}Q${x} ${y - 7} ${x + 12} ${y}Q${x} ${y + 7} ${x - 12} ${y}Z" transform="${t}" stroke-width=".9" stroke-opacity=".85"/><path d="M${x - 10} ${y}H${x + 10}" transform="${t}" stroke-width=".5" stroke-opacity=".6"/>`); });
  [[96, 66, 9], [150, 70, 9], [72, 98, 8], [174, 112, 8], [120, 64, 10], [132, 92, 7], [106, 96, 7]].forEach(([x, y, r]) => { coinFace(d, x, y + 6, r, r * .8, 3); d.path(ell(x, y + 6, r * .55, r * .44), .5, .6); });
  d.out('eng-coin.svg');
}

/* 6 a safe with a round door and a spoked handle (deposits) */
function vault() {
  const d = Doc(240, 228);
  ground(d, 124, 206, 92, 10);
  const L = 50, R = 170, T = 56, B = 196, DX = 20, DY = -14;
  const front = poly([[L, B], [R, B], [R, T], [L, T]]), top = poly([[L, T], [R, T], [R + DX, T + DY], [L + DX, T + DY]]), side = poly([[R, B], [R + DX, B + DY], [R + DX, T + DY], [R, T]]);
  [front, top, side].forEach(p => d.fill(p));
  d.hatch(top, [L, T + DY, R + DX, T], 0, 5, .4, .5);
  d.hatch(side, [R, T + DY, R + DX, B], 80, 2, .45, .85); d.hatch(side, [R, T + DY, R + DX, B], -25, 3, .4, .55);
  d.hatch(poly([[L, B], [L + 10, B], [L + 10, T], [L, T]]), [L, T, L + 10, B], 90, 2.6, .4, .5);
  [front, top, side].forEach(p => d.path(p, 1.4, .9));
  d.path(poly([[L + 8, B - 8], [R - 8, B - 8], [R - 8, T + 8], [L + 8, T + 8]]), .7, .75);
  const cx = (L + R) / 2 + 2, cy = (T + B) / 2;
  d.hatch(crescent(cx, cy, 44), [cx - 44, cy - 44, cx + 44, cy + 44], 45, 2.2, .45, .75);
  d.path(circ(cx, cy, 44), 1.4, .9); d.path(circ(cx, cy, 38), .7, .75);
  for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; d.path(`M${f(cx + Math.cos(a) * 38)} ${f(cy + Math.sin(a) * 38)}L${f(cx + Math.cos(a) * 41)} ${f(cy + Math.sin(a) * 41)}`, .7, .8); }
  for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3 + .3; d.path(`M${f(cx - Math.cos(a) * 24)} ${f(cy - Math.sin(a) * 24)}L${f(cx + Math.cos(a) * 24)} ${f(cy + Math.sin(a) * 24)}`, 2.2, .85); [1, -1].forEach(s => d.path(circ(cx + s * Math.cos(a) * 26, cy + s * Math.sin(a) * 26, 3), 1, .85)); }
  d.fill(circ(cx, cy, 8)); d.path(circ(cx, cy, 8), 1.2, .9); d.path(circ(cx, cy, 3), .8, .8);
  [T + 24, B - 34].forEach(y => d.path(poly([[L + 1, y], [L + 7, y], [L + 7, y + 12], [L + 1, y + 12]]), 1, .85));
  d.out('eng-bank.svg');
}

/* ── journey sides ── */
/* 7 a barometer dial (risk: said vs did) */
function gauge() {
  const d = Doc(240, 228), cx = 120, cy = 108, r = 76;
  ground(d, 122, 206, 70, 9);
  d.path(`M${cx - 18} 202H${cx + 18}L${cx + 12} ${cy + r - 2}H${cx - 12}Z`, 1.2, .85);
  d.hatch(`M${cx - 18} 202H${cx + 18}L${cx + 12} ${cy + r - 2}H${cx - 12}Z`, [cx - 18, cy + r, cx + 18, 202], 80, 2, .45, .8);
  d.fill(circ(cx, cy, r));
  d.hatch(`${circ(cx, cy, r)}${circ(cx, cy, r - 12)}`.replace(/Z(?=M)/, 'Z'), [cx - r, cy - r, cx + r, cy + r], 45, 2, .45, .75);
  d.raw(`<path d="${circ(cx, cy, r - 12)}" fill="${PAPER}" stroke="none"/>`);
  d.path(circ(cx, cy, r), 1.6, .9); d.path(circ(cx, cy, r - 12), 1, .85);
  for (let i = 0; i <= 40; i++) { const a = (210 - i * 6) * Math.PI / 180, big = i % 5 === 0, r1 = r - 18, r2 = r1 - (big ? 10 : 5); d.path(`M${f(cx + Math.cos(a) * r1)} ${f(cy - Math.sin(a) * r1)}L${f(cx + Math.cos(a) * r2)} ${f(cy - Math.sin(a) * r2)}`, big ? 1 : .5, .8); }
  d.path(`M${f(cx + Math.cos(210 * Math.PI / 180) * (r - 34))} ${f(cy - Math.sin(210 * Math.PI / 180) * (r - 34))}A${r - 34} ${r - 34} 0 1 1 ${f(cx + Math.cos(-30 * Math.PI / 180) * (r - 34))} ${f(cy - Math.sin(-30 * Math.PI / 180) * (r - 34))}`, .6, .6);
  // two needles: a hollow one (declared) and a solid one (actual)
  const nd = (deg, len, w, o) => { const a = deg * Math.PI / 180; d.path(`M${cx} ${cy}L${f(cx + Math.cos(a) * len)} ${f(cy - Math.sin(a) * len)}`, w, o); };
  nd(130, r - 26, 1, .6); nd(70, r - 22, 2.6, .9); nd(250, 14, 2.6, .9);
  d.fill(circ(cx, cy, 6)); d.path(circ(cx, cy, 6), 1.2, .9);
  d.out('eng-gauge.svg');
}

/* 8 a magnifying glass (lens) */
function lens() {
  const d = Doc(240, 228), cx = 100, cy = 92, r = 56;
  ground(d, 124, 206, 86, 9);
  const a = Math.PI / 4, hx = cx + Math.cos(a) * (r + 6), hy = cy + Math.sin(a) * (r + 6), L = 78, W = 12;
  const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
  const handle = poly([[hx + nx * W / 2, hy + ny * W / 2], [hx + ux * L + nx * W / 2, hy + uy * L + ny * W / 2], [hx + ux * L - nx * W / 2, hy + uy * L - ny * W / 2], [hx - nx * W / 2, hy - ny * W / 2]]);
  d.fill(handle); d.hatch(handle, [hx - 10, hy - 10, hx + L, hy + L], 45, 1.8, .45, .85); d.path(handle, 1.3, .9);
  d.path(`M${f(hx + ux * 16 + nx * 7)} ${f(hy + uy * 16 + ny * 7)}L${f(hx + ux * 16 - nx * 7)} ${f(hy + uy * 16 - ny * 7)}`, 1.4, .85);
  d.fill(circ(cx, cy, r + 7));
  d.hatch(`${circ(cx, cy, r + 7)}${circ(cx, cy, r)}`, [cx - r - 7, cy - r - 7, cx + r + 7, cy + r + 7], 30, 1.8, .45, .85);
  d.raw(`<path d="${circ(cx, cy, r)}" fill="${PAPER}" stroke="none"/>`);
  d.path(circ(cx, cy, r + 7), 1.5, .9); d.path(circ(cx, cy, r), 1.1, .9);
  // glare and a faint shade on the far side of the glass
  d.path(`M${cx - 36} ${cy - 18}A40 40 0 0 1 ${cx - 16} ${cy - 38}`, 1.4, .7); d.path(`M${cx - 38} ${cy - 6}A44 44 0 0 1 ${cx - 34} ${cy - 16}`, 1.4, .7);
  d.hatch(crescent(cx, cy, r - 2), [cx - r, cy - r, cx + r, cy + r], 30, 3.4, .4, .4);
  // a small candle chart seen through the lens
  [[-20, 12, 26], [-6, 0, 18], [8, -14, 10], [22, -26, 0]].forEach(([dx, top, bot]) => { const x = cx + dx; d.path(`M${x} ${cy + top - 6}V${cy + bot + 6}`, .8, .8); d.path(poly([[x - 4, cy + top], [x + 4, cy + top], [x + 4, cy + bot], [x - 4, cy + bot]]), .9, .85); });
  d.out('eng-lens.svg');
}

/* 9 a fishing hook baited with a coin (FOMO / scams) */
function hook() {
  const d = Doc(240, 228);
  ground(d, 124, 208, 60, 8);
  d.path(`M126 6V56`, .8, .75);
  d.path(`M126 56Q130 64 126 70`, 1, .8);
  // hook: drawn as a thick stroke with a thin inner line
  const hp = `M126 70V150Q126 186 100 186Q76 186 76 160L76 150`;
  d.path(hp, 5, .9); d.raw(`<path d="${hp}" stroke="${PAPER}" stroke-width="2.2" stroke-opacity="1"/>`);
  d.path(`M76 150L68 162M76 150L86 158`, 2.4, .9); // barb
  d.path(circ(126, 66, 5), 1.4, .85);
  // the coin hanging on the hook
  const cx = 100, cy = 150;
  d.fill(circ(cx, cy - 18, 26));
  d.hatch(crescent(cx, cy - 18, 26), [cx - 26, cy - 44, cx + 26, cy + 8], 45, 2, .45, .8);
  d.path(circ(cx, cy - 18, 26), 1.4, .9); d.path(circ(cx, cy - 18, 20), .7, .75);
  d.path(`M${cx - 6} ${cy - 30}H${cx + 3}Q${cx + 9} ${cy - 30} ${cx + 9} ${cy - 24}Q${cx + 9} ${cy - 19} ${cx + 3} ${cy - 19}H${cx - 6}M${cx + 3} ${cy - 19}Q${cx + 10} ${cy - 19} ${cx + 10} ${cy - 13}Q${cx + 10} ${cy - 6} ${cx + 3} ${cy - 6}H${cx - 6}M${cx - 4} ${cy - 30}V${cy - 6}M${cx} ${cy - 34}V${cy - 2}`, 1.6, .85);
  // a few wavy lines (water) and a sparkle to tempt
  d.path(`M30 30Q38 26 46 30T62 30M164 44Q172 40 180 44T196 44M150 110l6-6M150 104l6 6M44 96l5-5M44 91l5 5`, .8, .6);
  d.out('eng-hook.svg');
}

/* 10 an hourglass (life-stage goals) */
function hourglass() {
  const d = Doc(240, 228), cx = 120;
  ground(d, 120, 208, 64, 9);
  const plate = (y) => { const p = `M${cx - 54} ${y}A54 9 0 0 0 ${cx + 54} ${y}V${y + 8}A54 9 0 0 1 ${cx - 54} ${y + 8}Z`; d.fill(p); d.fill(ell(cx, y, 54, 9)); d.hatch(p, [cx - 54, y, cx + 54, y + 18], 0, 1.6, .45, .8); d.path(p, 1.2, .9); d.path(ell(cx, y, 54, 9), 1.2, .9); };
  const top = 28, bot = 188;
  const glass = `M${cx - 38} ${top + 10}Q${cx - 38} ${top + 56} ${cx - 6} ${(top + bot) / 2}Q${cx - 38} ${bot - 56} ${cx - 38} ${bot - 4}H${cx + 38}Q${cx + 38} ${bot - 56} ${cx + 6} ${(top + bot) / 2}Q${cx + 38} ${top + 56} ${cx + 38} ${top + 10}Z`;
  d.fill(glass);
  const mid = (top + bot) / 2;
  const sandTop = `M${cx - 30} ${top + 44}Q${cx} ${top + 52} ${cx + 30} ${top + 44}Q${cx + 28} ${top + 62} ${cx + 6} ${mid - 2}H${cx - 6}Q${cx - 28} ${top + 62} ${cx - 30} ${top + 44}Z`;
  const sandBot = `M${cx - 37} ${bot - 4}H${cx + 37}Q${cx + 30} ${bot - 30} ${cx} ${bot - 46}Q${cx - 30} ${bot - 30} ${cx - 37} ${bot - 4}Z`;
  d.hatch(sandTop, [cx - 32, top + 40, cx + 32, mid], 30, 1.6, .45, .8); d.path(sandTop, .8, .8);
  d.hatch(sandBot, [cx - 38, bot - 48, cx + 38, bot], 30, 1.6, .45, .8); d.path(sandBot, .8, .8);
  d.path(`M${cx} ${mid}V${bot - 46}`, .9, .75);
  d.path(glass, 1.2, .85);
  d.path(`M${cx - 30} ${top + 18}Q${cx - 30} ${top + 40} ${cx - 16} ${top + 54}`, 1.2, .55);
  [-50, 50].forEach(dx => { d.path(`M${cx + dx} ${top + 4}V${bot}`, 2.6, .85); });
  d.path(`M${cx} ${top + 8}V${top + 8}`, 1, 0);
  plate(top - 6); plate(bot);
  d.out('eng-hourglass.svg');
}

/* 11 a heart with a pulse line (health) */
function heart() {
  const d = Doc(240, 228), cx = 120;
  ground(d, 122, 206, 70, 9);
  const H = `M${cx} 190C${cx - 20} 172 ${cx - 92} 128 ${cx - 92} 82C${cx - 92} 52 ${cx - 68} 34 ${cx - 46} 34C${cx - 26} 34 ${cx - 10} 46 ${cx} 62C${cx + 10} 46 ${cx + 26} 34 ${cx + 46} 34C${cx + 68} 34 ${cx + 92} 52 ${cx + 92} 82C${cx + 92} 128 ${cx + 20} 172 ${cx} 190Z`;
  d.fill(H);
  d.hatch(H, [cx - 92, 34, cx + 92, 190], 50, 2.6, .4, .35);
  const shade = `M${cx + 92} 82C${cx + 92} 128 ${cx + 20} 172 ${cx} 190C${cx + 14} 168 ${cx + 76} 126 ${cx + 78} 84C${cx + 80} 60 ${cx + 66} 46 ${cx + 50} 42C${cx + 74} 40 ${cx + 92} 56 ${cx + 92} 82Z`;
  d.hatch(shade, [cx, 40, cx + 92, 190], -40, 1.8, .45, .85);
  d.path(H, 1.6, .9);
  d.path(`M${cx - 66} 66Q${cx - 60} 50 ${cx - 44} 48`, 1.6, .55);
  const pulse = `M${cx - 92} 104H${cx - 44}L${cx - 34} 86L${cx - 22} 128L${cx - 8} 66L${cx + 6} 116L${cx + 16} 98H${cx + 92}`;
  d.raw(`<path d="${pulse}" stroke="${PAPER}" stroke-width="6" stroke-opacity="1"/>`);
  d.path(pulse, 1.8, .9);
  d.out('eng-heart.svg');
}

/* 12 stone steps rising to a small flag (first step) */
function steps() {
  const d = Doc(240, 228);
  ground(d, 120, 206, 100, 10);
  const DX = 16, DY = -10, w = 44, h = 30;
  for (let i = 3; i >= 0; i--) {
    const x = 24 + i * w, top = 200 - (i + 1) * h;
    const front = poly([[x, 200], [x + w, 200], [x + w, top], [x, top]]);
    const tp = poly([[x, top], [x + w, top], [x + w + DX, top + DY], [x + DX, top + DY]]);
    const sd = poly([[x + w, 200], [x + w + DX, 200 + DY], [x + w + DX, top + DY], [x + w, top]]);
    [front, tp, sd].forEach(p => d.fill(p));
    d.hatch(tp, [x, top + DY, x + w + DX, top], 0, 5, .4, .5);
    d.hatch(front, [x, top, x + w, 200], 0, 3, .45, i === 0 ? .4 : .7);
    if (i === 3) { d.hatch(sd, [x + w, top + DY, x + w + DX, 200], 80, 2, .45, .85); d.path(sd, 1.2, .9); }
    d.path(front, 1.3, .9); d.path(tp, 1.2, .9);
    for (let k = 1; k < Math.round((200 - top) / 30) + 1; k++) d.path(`M${x} ${f(top + k * 30)}H${x + w}`, .6, .6);
  }
  // footprint on the first step and a flag on the last
  d.path(ell(46, 166, 6, 3), 1, .85); d.path(ell(58, 162, 6, 3), 1, .85);
  const fx = 24 + 3 * w + w / 2 + 8, fy = 200 - 4 * h - 4;
  d.path(`M${fx} ${fy}V${fy - 54}`, 1.8, .9);
  const flag = poly([[fx, fy - 54], [fx + 34, fy - 46], [fx, fy - 36]]); d.fill(flag); d.hatch(flag, [fx, fy - 54, fx + 34, fy - 36], 0, 1.8, .45, .85); d.path(flag, 1.2, .9);
  d.out('eng-steps.svg');
}

globe(); deed(); building(); crypto(); coinTree(); vault();
gauge(); lens(); hook(); hourglass(); heart(); steps();
console.log('ok');
