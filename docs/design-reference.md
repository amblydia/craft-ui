# Design reference

How CraftUI's look was derived, so it can be checked and extended.

## Sources

Colors and proportions were sampled pixel by pixel from the Ore UI design system
images published on the [Minecraft Wiki](https://minecraft.wiki/w/Ore_UI). The
images were viewed for study only and are **not** in this repository, and they must
not be added: they're the property of Mojang. Values like these are facts about a
color. The art itself isn't ours to distribute.

Ore UI's public repository, [mojang/ore-ui](https://github.com/Mojang/ore-ui), holds
state-management tooling only. Its components and design tokens aren't public, so
these measurements are the best available reference, not an official specification.

## The unit

In the references, every line is a multiple of one unit. CraftUI uses **1 unit = 2
CSS pixels** (`--craft-unit`).

## Measurements

Listed from top to bottom, in units.

| Control | Structure |
|---|---|
| Button | outline 1, highlight 1, face 18, low highlight 1, shade 2, outline 1 |
| Button, pressed | outline 1, highlight 1, face 18, low highlight 1, outline 1 (the shade is gone) |
| Slider track | outline 1, highlight 1, fill 2, low highlight 1, outline 1 |
| Slider thumb | 16 × 16, with the same bevel as a button |
| Switch | 30 × 16: a 16 × 16 thumb over a 14-unit-tall track, 2 units lower |
| Checkbox | 12 × 12: outline 1, highlight 1, face 8, low highlight 1, outline 1 |
| Input | outline 1, shade 2, face 20, outline 1 |
| Progress, thin | 2 units tall, without an outline: half-unit highlight, 1 unit of face, half-unit shade |
| Tab | 24 tall, as a button. Selected: loses the shade and sinks 2 units, with a 24-unit underline on its bottom edge |
| Scrollbar | 9 wide: outline 1, gap 1, thumb 5 (outlined in black), gap 1, outline 1 |
| Row (flat panel) | light line 1 at the top, dark line 1 at the bottom, no outline and no sides |
| Dialog footer | a row, with no dark divider above it |
| Tooltip | corners stepped by 1 unit, with a tail that's straight on one side |

## Colors

| Role | Face | Highlight | Low highlight | Shade |
|---|---|---|---|---|
| Primary | `#3C8527` | `#639D52` | `#4F913C` | `#1D4D13` |
| Primary, hover | `#52A535` | `#75B75D` | `#63AE49` | `#1D4D13` |
| Primary, pressed | `#2A641C` | `#558349` | `#3F7332` | none |
| Secondary | `#D0D1D4` | `#ECEDEE` | `#E3E3E5` | `#58585A` |
| Secondary, hover | `#F4F6F9` | `#FBFBFD` | `#F8FAFB` | `#58585A` |
| Secondary, pressed | `#B1B2B5` | `#E0E0E1` | `#D0D1D3` | none |
| Destructive | `#CA3636` | `#D55E5E` | `#CF4A4A` | `#AD1D1D` |
| Destructive, hover | `#FF8080` | `#FF9999` | `#FF8C8C` | `#AD1D1D` |
| Destructive, pressed | `#C02D2D` | `#CD5757` | `#C64242` | none |
| Disabled | `#D0D1D4` | none | none | `#B1B2B5`, outline `#8C8D90` |
| Track | `#8C8D90` | `#A3A4A6` | `#97989B` | none |
| Track, hover | `#B1B2B5` | `#C1C1C4` | `#B9BABC` | none |
| Track, pressed | `#58585A` | `#79797B` | `#68686A` | none |
| Tab, hover | `#58585A` | `#79797B` | `#68686A` | `#313233` |
| Tab, selected | `#313233` | `#5A5B5C` | `#454647` | none |
| Scrollbar thumb | `#E6E8EB` | `#F5F6F7` | `#F0F1F3` | none, outline `#000000` |
| Raised (tabs, title bars) | `#48494A` | `#6D6D6E` | `#5A5B5C` | `#313233` |
| Surface (menu rows) | `#48494A` | `#5A5B5C` | `#333334` | none |
| Sunken (dialog bodies) | `#313233` | `#454647` | `#222324` | none |
| Tooltip, info | `#2E6BE5` | `#5889EA` | `#204BA1` | none |
| Warning | `#FFE866` | none | none | none |

The outline is `#1E1E1F` everywhere, and the focus ring is solid white, hugging the
outline.

## Where CraftUI differs on purpose

Accessibility comes before fidelity. `themes/craft.test.ts` holds every text and
background pair to WCAG AA in both modes.

- **Hover labels.** The reference puts a white label on the bright hover fills, at
  about 3:1 on green and 2:1 on red. CraftUI keeps those fills but uses a dark label.
  To match the game, set `--craft-primary-hover-fg: #ffffff`.
- **Muted text.** The reference's description gray (`#B1B2B5`) reaches only 4.2:1 on
  `#48494A`, so dark mode uses `#D0D1D4`.
- **Focus in light mode.** A white ring disappears on a light page, so light mode uses
  blue (`#2E6BE5`).
- **Indeterminate checkboxes and the taller progress bar.** These aren't in the
  reference. They're additions for the web.

## Light mode

The references show dark menus, with light surfaces only as individual elements such
as the Play screen's top bar. CraftUI's light mode reuses the measured light neutrals
(`#F4F6F9`, `#E6E8EB`, `#D0D1D4`) for surfaces and keeps the action colors the same. It
wasn't made by inverting the dark values, and it's an interpretation rather than a
measurement.

## Type

Ore UI uses Mojangles and Minecraft Ten, which aren't available to distribute. CraftUI
uses **Departure Mono** by Helena Zhang (SIL Open Font License) for labels. Like
Mojangles, it's a thin, wide pixel face. At 22 pixels its capitals are 14 pixels tall,
which is 7 units, matching the reference. It's drawn on an 11-pixel grid, so CraftUI
only uses multiples of 11 pixels for it. **Noto Sans** (also SIL OFL) is used for long
text, as the references do.

The official font file and its license are in `apps/web/public/fonts`. There's no
official package on npm, and it isn't on Google Fonts, so the theme imports
`departure-mono.css` from the CraftUI site. The shadcn CLI can't write an `@font-face`
rule into a project's CSS, which is why it's a hosted stylesheet.

The reference's heavy Hero label has no free match, so the `hero` button uses Departure
Mono in capitals with the measured drop shadow (`#2A5D1B`).

## Recording new measurements

For a new component, find its control in the reference, scan one line of pixels through
it, and read off each run of a single color. Divide the run lengths by the image's unit
size, and record them here.
