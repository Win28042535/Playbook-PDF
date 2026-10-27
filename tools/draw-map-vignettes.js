// MAP DNA vignettes (2026-10-27, MAP-DNA.md): the small engraved ornaments a sea chart scatters in its empty water and land —
// curled waves, a range of hatched hills, a puffed cloud — in the line-tint inks (deep sepia outline, brass / red-brown
// hatching, no fill). Placed in a map sheet's empty lower band by pbxIllustrate.
// usage: node tools/draw-map-vignettes.js → assets/vig-waves.svg, vig-hills.svg, vig-cloud.svg
const fs = require('fs'), path = require('path'), OUT = path.join(__dirname, '..', 'assets');
const OUTL = '#3a2412', HAT = '#9a6a38', f = n => +(+n).toFixed(1);
let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280; // a steady hand wobble
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><g fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
const P = (d, c = OUTL, w = 1.3, o = .95) => `<path d="${d}" stroke="${c}" stroke-width="${w}" stroke-opacity="${o}"/>`;

// waves: three rows of curls, each curl a crest with its hooked lip and two short hatch strokes under it
(() => {
  let b = '';
  [[18, 22, 6], [44, 10, 5], [70, 30, 4]].forEach(([y, x0, n], r) => {
    for (let i = 0; i < n; i++) {
      const x = x0 + i * 46 + rnd() * 4, s = 1 - r * .12;
      b += P(`M${f(x)} ${y}q${f(10 * s)} ${f(-12 * s)} ${f(22 * s)} ${f(-6 * s)}q${f(6 * s)} ${f(3 * s)} ${f(2 * s)} ${f(7 * s)}q${f(-4 * s)} ${f(-1 * s)} ${f(-4 * s)} ${f(-4 * s)}`);
      b += P(`M${f(x + 22 * s)} ${f(y + 1)}q${f(10 * s)} ${f(4 * s)} ${f(20 * s)} ${f(-1 * s)}`, OUTL, 1, .8);
      for (let k = 0; k < 3; k++) b += P(`M${f(x + 6 + k * 5)} ${f(y + 4 + k * .4)}l${f(4 * s)} ${f(-2 * s)}`, HAT, .9, .8);
    }
  });
  fs.writeFileSync(path.join(OUT, 'vig-waves.svg'), svg(300, 84, b));
})();

// hills: a low range, the lit (left) slope bare, the shaded slope hatched down its fall line, a ground line under it
(() => {
  let b = '';
  [[10, 70, 48], [62, 120, 30], [104, 190, 56], [170, 236, 34]].forEach(([x0, x1, hgt]) => {
    const pk = x0 + (x1 - x0) * .45, base = 82;
    b += P(`M${x0} ${base}Q${f(pk - 8)} ${base - hgt} ${f(pk)} ${base - hgt}Q${f(pk + 10)} ${base - hgt + 2} ${x1} ${base}`);
    for (let t = .12; t < .95; t += .085) {
      const x = pk + (x1 - pk) * t, y = base - hgt * (1 - t) * (1 - t * .25);
      b += P(`M${f(x)} ${f(y + 2)}l${f(-3 - rnd() * 2)} ${f((base - y) * .75)}`, HAT, .9, .85);
    }
  });
  b += P('M2 82H246', OUTL, 1.1, .7);
  fs.writeFileSync(path.join(OUT, 'vig-hills.svg'), svg(250, 88, b));
})();

// cloud: puffed lobes on a flat hatched base, the underside shaded with short horizontal strokes
(() => {
  let b = P('M20 60Q8 60 10 50Q12 40 26 42Q28 26 46 28Q54 12 74 18Q90 8 104 24Q122 20 126 36Q142 36 140 50Q140 60 126 60Z');
  for (let y = 50; y <= 58; y += 3) b += P(`M${24 + (58 - y) * 2} ${y}H${130 - (58 - y) * 2}`, HAT, .9, .8);
  b += P('M46 32Q50 40 46 46M80 22Q84 32 80 40', OUTL, 1, .6);
  fs.writeFileSync(path.join(OUT, 'vig-cloud.svg'), svg(150, 66, b));
})();
console.log('ok');
