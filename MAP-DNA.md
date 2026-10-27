# MAP DNA — "The Capital Playbook 2027" (treasure-map reference, 2026-10-27)

Extracted from the supplied poster (an antique engraved sea chart with glass assets on brass pedestals, the title
embossed in bronze). Applied to the book as a **demo case** (`DEMO.map`, the on-screen "แผนที่ (Map DNA)" switch,
off by default; map sheets carry `.map`), never to the front / back covers. Trial sheets first (`pbxMapTrial`:
the pre-event card, the analysis opener, the 5-level table, the last sheet of พื้นฐานการลงทุน); `PBX_MAP_ALL`
turns it on for every inside sheet. Colours were sampled from the reference and rounded.

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

## What the book takes (after the 2026-10-27 review)
| | in the book |
|---|---|
| ink | `--ink #3b2a1c`, `--muted #7a6248`, `--rule #b59870` on map sheets: text, pills, header / footer hairlines and stars |
| drawings | line-tinted twins (`*.tint.png`, see below); no CSS filters (a PDF rasterises them per sheet) |
| text tones | one sepia, five weights: 1 `#24170c` headings + key figures · 2 `#3b2a1c` body + values · 3 `#6b5238` labels, column / row names · 4 `#8f765a` notes, sources · gold `#8a6a34` kickers, tags, secondary units ("/100") |
| borders by importance | **A result** (risk said / real pair, Confidence score, example level's row, the 100,000-baht result): no frame — a short hairline with a ✦ in its middle above and below the figure (the double frame was dropped 2026-10-27) · **B main message** (analysis verdict line, "ยิ่งขั้นสูง…", the mirror's lead): 2px gold bar down the left, ✦ heading it · **C worth a look** (status pill, the level-3 figures line): pale gold highlighter · **D dividers**: dotted gold rule (none under the analysis split's heads). All outlines / pseudo elements, so nothing reflows |
| rules | heading / table-head underlines as a dotted gold line (`#a88c62`, 2px dotted) |

## Line-tinted drawings (map sheets)
Every line drawing (openers, end-of-sheet figures, the journey's side figures, library category heads), the สารบัญ compass and the
footer flourish use `*.tint.png` (`tools/map-tint.js`, headless Chrome canvas pass at ~2x their box): **only the ink is recoloured**, by line role and light (from the upper left): thick outlines (found by an erosion of the ink)
deep sepia `#3a2412` → `#1f1208`; dense hatching brass `#a8803e` on the lit side → red-brown `#7a3f22` in shade; sparse thin
details light gold `#c49a52` → mid brown `#6b4a2a`. White fills and the line style (the engraved scale is the model) stay exactly
as drawn. A fill wash was tried and dropped the same day.

## Tried and dropped (2026-10-27, per direction)
- The burnt-edged map paper — the sheet keeps `paper-parchment.jpg`.
- Bronze-embossed key figures — figures keep the ink colour.
- Engraved all-caps Latin with a small "THE" — the silver Baskervville lines stay (Cinzel was not downloaded).
- The gold tint and gold tag on the example level's row — the row keeps the plain ink treatment.
- Dotted routes between the floating glass pieces, and glass on pedestals.
- Glass pieces in place of the line drawings (a separate "ภาพประกอบ: ชิ้นแก้ว" demo).
- The spectrum asset elements altogether (glass marks, their quiet map twins, and the redrawn engraved map icons that were to replace them): the book keeps only line drawings and the chart vignettes.

Still open for the full-book pass: the สารบัญ's route between chapters, small map vignettes (waves, hills) as
ornaments in empty bands.
