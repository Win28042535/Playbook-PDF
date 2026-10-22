// The ความสนใจ opener's drawing (2026-10-22): a brass telescope on a tripod, drawn in the hand-inked DNA of the supplied
// compass and scale (ILLUSTRATION-DNA.md): heavy silhouette, diagonal / along-the-form hatching on the shadow side, a bare
// highlight strip along each cylinder, banded joints. Weights follow the engrave recipe (1.6 heavy, 1.0 main, 0.45 fine);
// run tools/ink-dna.js on the output for the black ink, the three DNA weights and the hand wobble.
// usage: node tools/draw-telescope.js <outDir>  →  <outDir>/ill-telescope.svg
const fs = require('fs'), OUT = process.argv[2];
const f = n => +(+n).toFixed(1), PAPER = '#fafafc';
function Doc(w, h) {
  let defs = [], body = [], id = 0;
  const d = {
    clip(pd) { const k = 'c' + (id++); defs.push(`<clipPath id="${k}"><path d="${pd}" clip-rule="evenodd"/></clipPath>`); return k; },
    raw(s) { body.push(s); },
    fill(pd) { body.push(`<path d="${pd}" fill="${PAPER}" stroke="none"/>`); },
    path(pd, w = 1.0, o = .9) { body.push(`<path d="${pd}" stroke-width="${w}" stroke-opacity="${o}"/>`); },
    hatch(clipD, box, ang, gap, w = .45, o = .85) {
      const k = d.clip(clipD), [x0, y0, x1, y1] = box, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      const R = Math.hypot(x1 - x0, y1 - y0) / 2 + 2, a = ang * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
      let s = `<g clip-path="url(#${k})">`;
      for (let t = -R; t <= R; t += gap) { const px = cx + nx * t, py = cy + ny * t; s += `<path d="M${f(px - ux * R)} ${f(py - uy * R)}L${f(px + ux * R)} ${f(py + uy * R)}" stroke-width="${w}" stroke-opacity="${o}"/>`; }
      body.push(s + '</g>');
    },
    out(name) { fs.writeFileSync(OUT + '/' + name, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs>${defs.join('')}</defs><g fill="none" stroke="#111318" stroke-opacity=".78" stroke-linecap="round" stroke-linejoin="round">${body.join('')}</g></svg>`); }
  };
  return d;
}
const poly = pts => 'M' + pts.map(p => f(p[0]) + ' ' + f(p[1])).join('L') + 'Z';
const ell = (cx, cy, rx, ry) => `M${f(cx - rx)} ${f(cy)}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;
const box = pts => { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };

const d = Doc(600, 560);
// ── tripod: a leg is a tapered strip; its shadow half is hatched along the leg
function leg(top, foot, wTop, wFoot) {
  const dx = foot[0] - top[0], dy = foot[1] - top[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, ang = Math.atan2(dy, dx) * 180 / Math.PI;
  const P = (p, w, s) => [p[0] + nx * w * s, p[1] + ny * w * s];
  const shape = [P(top, wTop / 2, -1), P(top, wTop / 2, 1), P(foot, wFoot / 2, 1), P(foot, wFoot / 2, -1)];
  const shade = [top, P(top, wTop / 2, 1), P(foot, wFoot / 2, 1), foot];
  d.fill(poly(shape)); d.hatch(poly(shade), box(shade), ang, 2.4, .45, .85); d.path(poly(shape), 1.6);
  const m = [top[0] + dx * .42, top[1] + dy * .42], band = [P(m, wTop * .62, -1), P(m, wTop * .62, 1), P([m[0] + dx / L * 12, m[1] + dy / L * 12], wTop * .6, 1), P([m[0] + dx / L * 12, m[1] + dy / L * 12], wTop * .6, -1)];
  d.fill(poly(band)); d.hatch(poly(band), box(band), ang + 90, 2.2, .45, .85); d.path(poly(band), 1.0);
  d.path(`M${f(P(foot, wFoot, -1)[0])} ${f(P(foot, wFoot, -1)[1])}L${f(P(foot, wFoot, 1)[0])} ${f(P(foot, wFoot, 1)[1])}`, 1.6);
}
leg([301, 322], [338, 514], 10, 7);          // back leg, drawn first so the front ones cover it
leg([288, 320], [134, 540], 18, 11);
leg([312, 320], [466, 540], 18, 11);
// ── hub: a short cylinder, shadow on the right
const hub = `M266 306H334V322A34 9 0 0 1 266 322Z`;
d.fill(hub); d.fill(ell(300, 306, 34, 9));
d.hatch(`M305 306H334V322A34 9 0 0 1 305 330Z`, [300, 300, 336, 332], 90, 2.2, .45, .85);
d.path(hub, 1.6); d.path(ell(300, 306, 34, 9), 1.0);
// ── pivot block and knob
const blk = poly([[287, 226], [313, 226], [313, 302], [287, 302]]);
d.fill(blk); d.hatch(poly([[301, 226], [313, 226], [313, 302], [301, 302]]), [300, 226, 314, 302], 90, 2.2, .45, .85); d.path(blk, 1.6);
d.fill(ell(318, 268, 8, 8)); d.hatch(ell(318, 268, 8, 8), [310, 260, 326, 276], 45, 2.2, .45, .85); d.path(ell(318, 268, 8, 8), 1.6); d.path(ell(318, 268, 3, 3), 1.0);

// ── the tube, drawn level and turned 20° up to the left about the clamp
const CY = 210;
d.raw(`<g transform="rotate(-20 300 ${CY})">`);
function cyl(x0, x1, r, opts = {}) {
  const side = poly([[x0, CY - r], [x1, CY - r], [x1, CY + r], [x0, CY + r]]);
  d.fill(side);
  d.hatch(poly([[x0, CY + r * .22], [x1, CY + r * .22], [x1, CY + r], [x0, CY + r]]), [x0, CY, x1, CY + r], 0, 2.3, .45, .85);   // shadow underside, along the form
  d.hatch(poly([[x0, CY - r * .2], [x1, CY - r * .2], [x1, CY + r * .22], [x0, CY + r * .22]]), [x0, CY - r * .2, x1, CY + r * .22], 0, 5, .45, .5); // half-tone
  d.hatch(poly([[x0, CY - r], [x1, CY - r], [x1, CY - r * .62], [x0, CY - r * .62]]), [x0, CY - r, x1, CY - r * .62], 0, 5, .45, .5); // upper edge; the strip between stays bare
  d.path(`M${x0} ${CY - r}H${x1}M${x0} ${CY + r}H${x1}`, 1.6);
  for (const bx of opts.bands || []) {
    const b = poly([[bx, CY - r - 2], [bx + 9, CY - r - 2], [bx + 9, CY + r + 2], [bx, CY + r + 2]]);
    d.fill(b); d.hatch(b, [bx, CY - r - 2, bx + 9, CY + r + 2], 90, 2.1, .45, .85); d.path(b, 1.0);
  }
  d.path(ell(x1, CY, r * .28, r), 1.0); // the step to the next, narrower section
}
cyl(480, 516, 17);                                   // eyepiece first (it sits behind the wider joints)
cyl(390, 482, 29, { bands: [394, 470] });
cyl(250, 392, 40, { bands: [255, 380] });
cyl(70, 252, 52, { bands: [80, 238] });
// clamp ring around the tube at the pivot
const cl = poly([[292, CY - 44], [308, CY - 44], [308, CY + 44], [292, CY + 44]]);
d.fill(cl); d.hatch(cl, [292, CY - 44, 308, CY + 44], 90, 2.1, .45, .85); d.path(cl, 1.6);
// objective: the lens end facing up-left
d.fill(ell(70, CY, 15, 52)); d.hatch(`M70 ${CY}A15 52 0 0 1 70 ${CY + 52}A15 52 0 0 1 70 ${CY}Z`, [55, CY, 85, CY + 52], 30, 2.3, .45, .85);
d.path(ell(70, CY, 15, 52), 1.6); d.path(ell(70, CY, 10, 40), 1.0);
d.path(`M64 ${CY - 26}Q62 ${CY - 10} 64 ${CY + 6}M67 ${CY - 34}Q65 ${CY - 22} 66 ${CY - 12}`, .45, .9); // glints
// eyepiece cup
d.fill(ell(516, CY, 5, 17)); d.path(ell(516, CY, 5, 17), 1.6);
d.raw('</g>');
d.out('ill-telescope.svg');
console.log('ok');
