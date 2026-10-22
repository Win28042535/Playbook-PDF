# Illustration DNA — Playbook Ver.2 (parchment edition)

Source: `เข็มทิศ.png` (supplied 2026-10-22, 3200 × 3201 px, transparent), used on สารบัญ as `assets/toc-compass.png`.
Measured on the source; percentages are of the drawing's width so they scale to any icon size.

## 1. Character of the line

| Trait | Compass (target) | Current engraved set (`eng-*.svg`, `ill-*.svg`) |
|---|---|---|
| Ink | Pure black `#000`, 100% opacity; tone comes only from the line, never grey fills | `#111318` at 78–95% stroke opacity (reads grey) |
| Heavy line (outer contours, rings, star outlines) | ≈ 1.1–1.25% of width (35–40 px @ 3200) | 0.75% (1.8 on a 240 box) |
| Main line (inner rings, secondary edges) | ≈ 0.5% (16 px @ 3200) | 0.5% (1.2) ✔ |
| Fine line (hatching, ticks) | ≈ 0.3–0.4% (8–13 px @ 3200) | 0.19% (0.45) — too thin |
| Hand | Drawn by hand: slight wobble, uneven stroke width, rounded ends, ticks irregular | Geometric, perfectly even |
| Shading | Parallel hatching on **one half** of each form (light from the upper left), dense bundles | Same idea ✔ but lighter, sparser |
| Fills | None (the paper shows through) | Paper-white `#fafafc` fills to hide lines behind |
| Ground | No ground shadow | A hatched ground ellipse under most pieces |
| Dashes / ticks | Dashed ring of long–short dashes; radial ticks of varied length | — |
| Lettering inside art | Didone / Bodoni-like serif capitals, high contrast (N E S W) | none |
| Coverage | ≈ 9% of the drawing's box is ink | similar |

### Second reference: the scale (`magnific__-2-1__48422.png`, 3200 px, 2026-10-22) — same DNA, adds:

- **Silhouette heaviest:** the outer contour runs 30–50 px @ 3200 (≈ 1–1.5%), inner edges lighter (≈ 0.5%).
- **Diagonal hatching at ~45°**, 6–14 px lines (≈ 0.2–0.45%), dense, only on the shadow side (right / underside).
- **Hatching follows the form** on round volumes (the pans, the stepped base) instead of running straight across.
- **A highlight strip left bare** on cylinders (the pillar), so the form reads as round.
- Chains / cords as a thin twisted double line; knobs and pins as a circle with an inner ring.
- Ink ≈ 10% of the box. Now the analysis opener's drawing (`assets/ill-scale.png`, 600 px alpha-only, 90 KB),
  replacing the generated `ill-scale.svg`.

The weights and ink of the 32 generated drawings were brought in line (§4); bare highlight strips and form-following
hatching need a drawing redone by hand, so hand-drawn replacements (like the compass and the scale) are the way to get those.

## 2. Rules for new or redrawn illustrations

1. One colour: black ink only. Any lightness is set on the page (`opacity`), not in the drawing.
2. Three weights only: heavy ≈ 1.2%, main ≈ 0.5%, fine ≈ 0.35% of the drawing's width.
3. Shade with hatching on the side away from the upper-left light; no grey fills, gradients or shadows.
4. Transparent background; no ground ellipse. Where a front shape must hide lines behind it, mask those lines in the drawing instead of filling with a paper colour.
5. Hand-drawn feel: small irregularity in line paths and widths, rounded line ends.
6. Letters inside a drawing: high-contrast serif capitals (Baskervville on the page itself).

## 3. Weight budget (so the ebook PDF stays light)

A PDF from Chrome keeps JPEG compressed but stores PNG / WebP / SVG-with-filters as lossless pixels, and rasterises
some CSS effects for a whole page. So:

- Line art: ship alpha-only (black + transparency) PNG, sized to ≈ 1–1.2× the largest size it is shown at
  (e.g. the สารบัญ compass: shown 849 px → `toc-compass.png` 900 px, gray+alpha, black channel zeroed: 140 KB).
  Or a plain SVG with no filters (vector, near-zero weight).
- Never put SVG filters (`feTurbulence`), CSS gradients or `mix-blend-mode` on a large area of every page:
  Chrome turns that into a full-page image on each sheet (that was 45 MB of the 58 MB PDF on 2026-10-22).
  Paper texture is one shared JPEG (`assets/paper-parchment.jpg`, 39 KB).
- Opaque pictures (covers): JPEG, quality ≈ 80, 1240 × 1754 at most.
- Pictures with transparency (character cut-outs): ≤ 760 px on the long side, WebP.
- Check after every asset change: print the book to PDF (headless Chrome) and look at the image objects.

## 4. Applied to the book (2026-10-22)

All 32 engraved drawings (`assets/eng-*.svg`, `assets/ill-*.svg`) went through `tools/ink-dna.js`, which applies §2 to the
generator output: black ink at full opacity, the three weights (±12% per line), light hatching thinned to every other line
at full ink, the ground ellipse removed, a small seeded wobble on every point. Paper fills stay (they hide what lies behind
a form; the page multiplies them away). Each file is marked `data-ink="dna"` so the pass never runs twice.

If a generator (`tools/engrave-assets-*.js`, `tools/eng3-generator.js`) is re-run, run `node tools/ink-dna.js <the new files>` after it.
