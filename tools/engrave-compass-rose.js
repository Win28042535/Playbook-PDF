// The compass rose behind สารบัญ (2026-10-22, drawn to match the supplied TOC layout): an eight-point rose whose four long points
// reach past a ticked double ring with a dashed band inside it; one half of every point hatched. Same recipe as engrave-assets-1..3.js;
// drawn in ink and laid on the sheet faintly (CSS opacity), the N / W / S letters are set in HTML beside it.
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
function rose() {
  const S = 600, C = 300, R = 247, d = Doc(S, S);
  const P = (a, r) => [C + Math.sin(a) * r, C - Math.cos(a) * r];
  d.path(circ(C, C, R), 2.2, .9); d.path(circ(C, C, R - 9), 1, .8);
  for (let k = 0; k < 72; k++) { const a = k * 5 * Math.PI / 180, long = k % 9 === 0, [x1, y1] = P(a, R - 9), [x2, y2] = P(a, R - (long ? 26 : 18)); d.path(`M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`, long ? 1.6 : .9, .8); }
  d.raw(`<path d="${circ(C, C, 205)}" stroke-width="8" stroke-opacity=".7" stroke-dasharray="34 15"/>`);
  d.path(circ(C, C, 194), 1, .75); d.path(circ(C, C, 216), 1, .75);
  const point = (a, L, w) => { // a kite from the centre to the tip, its two halves
    const tip = P(a, L), l = P(a - Math.PI / 4, w * Math.SQRT2), r = P(a + Math.PI / 4, w * Math.SQRT2);
    const half1 = poly([[C, C], tip, l]), half2 = poly([[C, C], tip, r]);
    d.fill(half1); d.fill(half2);
    d.hatch(half2, [Math.min(C, tip[0], r[0]) - 2, Math.min(C, tip[1], r[1]) - 2, Math.max(C, tip[0], r[0]) + 2, Math.max(C, tip[1], r[1]) + 2], a * 180 / Math.PI - 90, 2.2, .5, .85);
    d.path(half1, 1.5, .9); d.path(half2, 1.5, .9);
  };
  [45, 135, 225, 315].forEach(g => point(g * Math.PI / 180, 178, 24));
  [0, 90, 180, 270].forEach(g => point(g * Math.PI / 180, 292, 34));
  d.fill(circ(C, C, 60)); d.path(circ(C, C, 60), 1.6, .9); d.path(circ(C, C, 50), 1, .8);
  for (let k = 0; k < 16; k++) { const a = k * 22.5 * Math.PI / 180, [x1, y1] = P(a, 50), [x2, y2] = P(a, 60); d.path(`M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`, .8, .7); }
  d.fill(circ(C, C, 12)); d.path(circ(C, C, 12), 1.6, .9); d.path(circ(C, C, 4), 1.2, .9);
  d.out('ill-compass-rose.svg');
}
rose();
console.log('ok');
