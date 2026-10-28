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

## Portfolio sheets as magazine pages (map sheets, 2026-10-28)
- **พอร์ต 5 ระดับ:** a 23px headline that says the story ("ยิ่งขั้นสูง เงินยิ่งย้ายจากเงินฝากไปอยู่ในหุ้น"), a colour key, then one 100%
  bar per level in four sepia-gold inks (bar lengths = range mid-points scaled to 100%, the true ranges printed under each bar);
  the example level a 38px bar in full ink with its figures inside, a 58px numeral, gold tag and gold rules; the other levels
  8px bars at 35% opacity with faint labels. Notes gathered at the foot.
- **ถือ 1 ปี:** a headline ("ยิ่งขั้นสูง ปีดีได้มากขึ้น แต่ปีแย่ก็ลึกขึ้น"), the example level's four figures as a stat row (worst, normal,
  best, % ending in loss — moved here from the 5-level sheet), then a tall range chart: worst-to-best bars with both ends
  printed, the normal year a dot, a strong 0% rule with the loss side washed; the example level thick and in ink, the others
  slim and faint; the yearly average as a figure column at the right; an inline key.
- **100,000 บาท 10 ปี:** a headline with the end value, the example level's four figures as a stat row between ✦ rules, the chart,
  then the three levels' end values side by side (the example level in ink).
- **เลือกระดับ:** a headline ("ระดับที่ใช่ ขึ้นกับใจ ความพร้อม และเวลา ของคุณ"), items under large gold Roman numerals, the CTA
  centred between ✦ rules.
- **The ✦ rule pair** (`.pbx-sr`): every stat row sits between two 2px rules that fade in from both ends toward a cast-gold ✦.

## The same DNA on the identity and interest sheets (map sheets, 2026-10-28)
- **ตัวตน (sheet 2) / หลังร่วมงาน (sheet 4):** the preferred assets as a headline ("คุณถนัด กองทุนรวม หุ้นไทย และทองคำ", the
  names in gold); strengths | watch-outs unchanged.
- **SKILL (sheet 2) / behaviour scores (sheet 8):** the figures as a stat row between ✦ rules, the strongest (highest share of
  its maximum) 40px in ink with a bold label, the others 28px in tone 3 with their bars at half strength; every bar on one
  line, at the foot of the tallest cell. The scores open with a headline naming the strongest ("จุดแข็งที่ชัดที่สุดของคุณคือ…").
- **Interests (sheet 8):** a headline naming the leader (several when tied); the leader keeps its ✦ rules and "อันดับ 1" tag,
  every other row steps back (22px faint figure, bar at 35%).
- **Radar (sheet 7, the interests opener):** a headline naming the strongest axis with its score (the short "ต่างปท." spelled out),
  then the axes as the interests sheet's rows: the leader between ✦ rules with "อันดับ 1", the others stepping back.
- **The journey's six sides (sheets 16–17):** each side opens with a 19px headline saying its result (words from the side's own
  copy), then its figures: risk said | real (2 | 2) and the FOMO rule centred between ✦ rules; the lens shares and Health-Wealth
  as plain stat rows with bars (no rules, per direction); the life-stage goals as four "อายุ 25 / 35 / 50 / 65" cells; the first
  step's three moves under gold Roman numerals. The rest of the words become italic notes.
- **Decision mix (sheet 9):** a headline ("เริ่มจากสินทรัพย์แกนหลักราว 40% ของพอร์ต"), one 38px 100% bar in the 5-level inks,
  a four-cell key under it with the largest share in ink.

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
