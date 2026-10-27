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
| drawings | line-tinted twins (`*.tint.png`, below); no lower-right figures on map sheets; no CSS filters (a PDF rasterises them per sheet) |
| rules | heading / table-head underlines as a dotted gold line (`#a88c62`, 2px dotted); none under the analysis split's heads or the 100,000-baht heading |
| สารบัญ | chapter ✦ in sepia, joined by a dotted route down the chapter column; the compass watermark in its tinted twin |

### Emphasis by importance
- **A result** — a pale gold field and a larger figure in tone 1:
  - list rows (the first row of interests, behaviour scores, decision mix): the whole row washed (dark at the figure,
    fading left), the field 20px past the column so the data keeps its line (map sheets do not clip their body); label bold, figure 50px (rows 36px), the bar
    gold and 6px; a ranked list's top row carries an "อันดับ 1" tag (interests, decision mix — not the behaviour scores,
    which keep their topic order)
  - said / real pairs (the analysis 4 / 4, the mirror's 4/10 → 4/10): one rounded band, darker in the middle, split by a
    thin upright rule (the mirror's arrow does the splitting there); analysis figures 88px
  - stand-alone figures (Confidence 40/100 at 76px, the 100,000-baht result): a soft gold panel
  - the 5-level table's example row: the row washed, the level numeral 52px, its bands gold and 6px
- **B main message** (the analysis verdict line, "ยิ่งขั้นสูง…", the mirror's lead, the 3-points CTA): a gold ✦ at its head.
- **C worth a look** (the status pill, the level-3 figures line, the one-year ladder's example row, the library's
  "คนมักเข้าใจผิด" notes, the journey's own results): a pale gold highlighter.
- **The library's example notes** (no "คนมักเข้าใจผิด" label): no fill, a gold rule down the left, a "ตัวอย่าง" tag, italics — so they read apart from the misconception notes.
- **D dividers**: the dotted gold rule.

## Line-tinted drawings (map sheets)
Every line drawing (openers, the journey's side figures, library category heads), the สารบัญ compass and the footer
flourish use `*.tint.png` (`tools/map-tint.js`, headless Chrome canvas pass at ~2x their box): **only the ink is
recoloured**, by line role and light (from the upper left): thick outlines (found by an erosion of the ink) deep sepia
`#3a2412` → `#1f1208`; dense hatching brass `#a8803e` on the lit side → red-brown `#7a3f22` in shade; sparse thin details
light gold `#c49a52` → mid brown `#6b4a2a`. White fills and the line style (the engraved scale is the model) stay exactly
as drawn.

## Tried and dropped (2026-10-27, per direction)
- The burnt-edged map paper — the sheet keeps `paper-parchment.jpg`.
- Bronze-embossed key figures, and engraved all-caps Latin with a small "THE" (Cinzel was not downloaded).
- Double frames, then ✦ hairlines above / below the key figures — replaced by the gold fields above.
- The gold bar down the left of main messages and of the library pull-quotes.
- A sand / ochre fill wash inside the drawings (only the ink is tinted).
- Glass pieces in place of the line drawings; dotted routes between glass pieces; glass on pedestals.
- The spectrum asset elements altogether (glass marks, their quiet map twins, and the redrawn engraved map icons).
- The small chart vignettes (waves, hills, a cloud) in empty lower bands, and the lower-right line drawings on map sheets.
