# MAP DNA — "The Capital Playbook 2027" (treasure-map reference, 2026-10-27)

Extracted from the supplied poster (an antique engraved sea chart with glass assets on brass pedestals, the title
embossed in bronze). Applied to the book as a **demo case** (`DEMO.map`, the on-screen "แผนที่ (Map DNA)" switch,
off by default; map sheets carry `.map`) on every inside sheet and the สารบัญ (`PBX_MAP_ALL`), never on the front /
back covers. Colours were sampled from the reference and rounded.

## What the reference does
1. **Drawing** — engraved / etched line like a printed sea chart, **sepia ink, never black**; hatching and
   cross-hatching, curled waves, hatched clouds, tiny vignettes (hills, palms, castles); a compass rose with serif
   N · E · S · W; dotted routes with ✦ way-points.
2. **Colour** — sand paper `#e4ca95` burning to `#bb9461` / `#835d3c` at the edges; ink `#3b2a1c`; antique gold
   `#ac8c55` and pewter for metal; the rainbow only as a faint sheen on glass and one thin light leak.
3. **Glass** — warm, mostly clear glass on gold-rimmed pedestals; colour is a faint iridescent glint, not a fill.
4. **Type** — engraved all-caps serif (Trajan / Cinzel-like) embossed in bronze, a small "THE".
5. **Frame** — no hard border; burnt edges and the compass rose do the framing.
6. **Hierarchy** — three tiers: embossed title › metal / glass objects › faint chart linework.

## What the book takes
| | in the book |
|---|---|
| ink | `--ink #3b2a1c`, `--muted #8f765a`, `--rule #b59870` on map sheets: text, pills, header / footer hairlines and stars |
| text tones | one sepia, five weights: 1 `#24170c` headings, key figures, article titles, glossary terms · 2 `#3b2a1c` body + values · 3 `#6b5238` labels, column / row names · 4 `#8f765a` notes, sources · gold `#8a6a34` kickers, list markers, the Roman numerals, secondary units ("/100") |
| Latin display | the opener's Latin line and the persona card's English name: champagne-gold crystal — bronze at the ends, a rainbow band (violet → blue → gold → rose → amber) across the middle, every stop dark enough to read on the paper (2026-10-28, from the second New Style set; a white glint in the middle was dropped — letters vanished there) |
| opener drawings | the "New Style" engravings (`Icon/New Style`, second set 2026-10-28: champagne-gold crystal, hatched, on aged paper) → `assets/ill-*-iri.jpg`; the paper flattened to white by `tools/flatten-paper.js` so they multiply into the sheet; the chart's lower-right rainbow haze toned down afterwards |
| other drawings | line-tinted twins (`*.tint.png`, below); no lower-right figures on map sheets; no CSS filters (a PDF rasterises them per sheet) |
| rules | heading / table-head underlines as a dotted gold line (`#a88c62`, 2px dotted); none under the analysis split's heads or the 100,000-baht heading |
| สารบัญ | chapter ✦ in sepia, joined by a dotted route down the chapter column; the compass watermark in the warm tint, multiplied |

### Emphasis by importance
- **A result** — the figure larger and in tone 1:
  - emphasised rows (the first row of interests, behaviour scores, decision mix; the 5-level table's and the one-year
    ladder's example rows): a 2px rule above and below, fading in from both ends and deepening toward a cast-gold ✦ at its
    middle; label bold (the table's level name 17px, the ladder's level and average 18px with the figure 22px), figure 50px
    (rows 36px), the bar 6px in gold on the rows' own grey track; a ranked list's top row and the table's example row carry
    a solid gold tag ("อันดับ 1", "ระดับตัวอย่าง")
  - said / real pairs (the analysis 4 / 4 split by a thin upright rule, the mirror's 4/10 → 4/10) and Confidence 40/100:
    no field, figures 88 / 72 / 76px
  - the 100,000-baht result: the same rules and ✦ as the emphasised rows (its gold band was dropped)
- **B main message**: no marker, except the 3-points sheet's call to the adviser — a gold ✦ with a fading gold bar under it.
- **C worth a look** (the status pill, the level-3 figures line, the library's "คนมักเข้าใจผิด" notes, the journey's own
  results): a pale gold highlighter.
- **The library's example notes** (no "คนมักเข้าใจผิด" label): no fill, a gold rule down the left, a "ตัวอย่าง" tag, italics.
- **D dividers**: the dotted gold rule.

## Line-tinted drawings (map sheets)
Every other line drawing (library category heads, the journey's side figures) uses `*.tint.png` (`tools/map-tint.js`,
headless Chrome canvas pass at ~2x its box): **only the ink is recoloured**, in the champagne-gold crystal colours — gold-brown outlines, lighter on the lit side
(found by an erosion of the ink), hatching in a rainbow running along the light from the upper left over a champagne base;
white fills, no glints. The สารบัญ compass and the footer flourish keep the warm inks (deep sepia
outlines, brass → red-brown hatching). Size: laid on white (they multiply into the sheet) and reduced to a 256-colour palette
— the set is ~0.55 MB instead of ~3.4 MB.

## Tried and dropped (2026-10-27 / 28, per direction)
- The burnt-edged map paper — the sheet keeps `paper-parchment.jpg`.
- Bronze-embossed key figures, an iridescent top edge on the key figures, and engraved all-caps Latin with a small "THE".
- Double frames, ✦ hairlines round single figures, gold fields behind the rows and pairs.
- The gold bar down the left of main messages and of the library pull-quotes; ✦ before the main messages.
- A sand / ochre fill wash inside the drawings; gold glints on the small drawings.
- Glass pieces in place of the line drawings; dotted routes between glass pieces; glass on pedestals.
- The spectrum asset elements altogether (glass marks, their quiet map twins, and the redrawn engraved map icons).
- The small chart vignettes, the lower-right line drawings on map sheets, faint background drawings on other sheets, and
  the metal badges / glass chart sampled on the สารบัญ.
