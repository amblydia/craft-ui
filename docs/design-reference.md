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

Listed from top to bottom, in units. The design system images on the wiki are all
exported at the same scale, about 4.54 pixels per unit: a button is 109 pixels for
24 units. One-unit lines are rounded to 5 pixels in them, so measure the faces, not
the lines, to count units.

| Control | Structure |
|---|---|
| Button | outline 1, highlight 1, face 18, low highlight 1, shade 2, outline 1 |
| Button, pressed | outline 1, highlight 1, face 18, low highlight 1, outline 1 (the shade is gone) |
| Slider track | outline 1, highlight 1, fill 2, low highlight 1, outline 1 |
| Slider thumb | 16 × 16, with the same bevel as a button |
| Switch | 30 × 16: a 16 × 16 thumb over a 14-unit-tall track, 2 units lower |
| Checkbox | 13 × 13: outline 1, highlight 1, face 9, low highlight 1, outline 1, with a one-unit tick |
| Input | outline 1, shade 2, face 20, outline 1 |
| Progress, thin | 2 units tall, without an outline: half-unit highlight, 1 unit of face, half-unit shade |
| Tab | 24 tall, as a button. Selected: loses the shade and sinks 2 units, with a 24-unit underline on its bottom edge. The focus ring sits outside the outline, and a disabled tab looks like the others |
| Toggle button | as tabs, in the light and green colors; the choices share the width and long labels wrap |
| Dialog title bar | a back arrow 4 × 8 units and a close cross 8 × 8, both drawn with one-unit strokes |
| Switch marks | "I" in white, "O" in `#242425`; both `#666666` when disabled |
| Scrollbar | 9 wide: outline 1, gap 1, thumb 5 (outlined in black), gap 1, outline 1 |
| Row (flat panel) | light line 1 at the top, dark line 1 at the bottom, no outline and no sides |
| Dialog footer | a row, with no dark divider above it |
| Tooltip | corners stepped by 1 unit, with a tail that's straight on one side |
| Dropdown, light | as the secondary button, but pressing keeps the shade: it doesn't sink |
| Dropdown, dark | outline 1, highlight 1, face, low highlight 1, outline 1, with no shade |
| Open list | outline 1, then a line 1 unit wide around and between rows 23 units tall |
| Radio | a 10-unit square with the checkbox's bevel, turned 45°: 14 units corner to corner, with a 4-unit gem in the middle |
| Tag | 15 units tall, 3 units of padding, no outline |
| Message bar | a flat fill, 14 units tall, with no outline |
| Expandable row | outline 1, highlight 1, face, low highlight 1, outline 1 |
| Sidebar section | a dark line 1 and a light line 1 under its heading |
| World card | outline 1, a 16:9 picture, a body with the name and tags, then a full-width Edit row |
| Settings row | a row (light line 1 at the top, dark line 1 at the bottom), label and description on the left, control on the right |
| Selected tile | outline 1, then a light green line 1 and a green frame 2 inside it |

## Colors

| Role | Face | Highlight | Low highlight | Shade |
|---|---|---|---|---|
| Primary | `#3C8527` | `#639D52` | `#4F913C` | `#1D4D13` (label `#FFFFFF` in every state) |
| Primary, hover | `#52A535` | `#75B75D` | `#63AE49` | `#1D4D13` |
| Primary, pressed | `#2A641C` | `#558349` | `#3F7332` | none |
| Secondary | `#D0D1D4` | `#ECEDEE` | `#E3E3E5` | `#58585A` |
| Secondary, hover | `#F4F6F9` | `#FBFBFD` | `#F8FAFB` | `#58585A` |
| Secondary, pressed | `#B1B2B5` | `#E0E0E1` | `#D0D1D3` | none |
| Destructive | `#CA3636` | `#D55E5E` | `#CF4A4A` | `#AD1D1D` |
| Destructive, hover | `#FF8080` | `#FF9999` | `#FF8C8C` | `#AD1D1D` |
| Destructive, pressed | `#C02D2D` | `#CD5757` | `#C64242` | none |
| Disabled | `#D0D1D4` | none | none | `#B1B2B5`, outline `#8C8D90`, label `#48494A` |
| Track | `#8C8D90` | `#A3A4A6` | `#97989B` | none |
| Track, hover | `#B1B2B5` | `#C1C1C4` | `#B9BABC` | none |
| Track, pressed | `#58585A` | `#79797B` | `#68686A` | none |
| Tab, hover | `#58585A` | `#79797B` | `#68686A` | `#313233` |
| Tab, selected | `#313233` | `#5A5B5C` | `#454647` | none |
| Scrollbar thumb | `#E6E8EB` | `#F5F6F7` | `#F0F1F3` | none, outline `#000000` |
| Raised (tabs, title bars) | `#48494A` | `#6D6D6E` | `#5A5B5C` | `#313233` |
| Surface (menu rows) | `#48494A` | `#5A5B5C` | `#333334` | none |
| Sunken (dialog bodies) | `#313233` | `#454647` | `#222324` | none |
| Hero label shadow | `#2A5D1B` normal, `#3A7425` hover, `#1D4614` pressed | none | none | none |
| Tooltip, info | `#2E6BE5` | `#5889EA` | `#204BA1` | none |
| Warning | `#FFE866` | none | none | none |
| Dropdown, dark | `#313233` | `#5A5B5C` | `#222324` | none |
| List row | `#58585A` | none | none | none, lines `#8C8D90` |
| Radio gem | `#E6E8EB` on the sides | `#FFFFFF` at the top | `#D0D1D4` at the bottom | none |
| Expandable row | `#48494A` | `#6D6D6E` | `#333334` | none |
| Sidebar, selected | `#48494A` on `#313233` | none | none | none |
| Tags | `#1E1E1F`, `#6CC349`, `#8CB3FF`, `#FFE866`, `#FF8080`, `#AC90F3` | none | none | none |
| Message bars | `#FFE866` (important), `#2E6BE5` (information) | none | none | none |

The outline is `#1E1E1F` everywhere, and the focus ring is solid white, hugging the
outline.

## Where CraftUI differs on purpose

The reference comes first, and accessibility close behind. `themes/craft.test.ts` holds every text and
background pair to WCAG AA, apart from the hover labels below.

- **Hover labels, which follow the reference.** The labels stay white on the bright
  hover fills, as in the game: 3.1:1 on `#52A535` and 2.4:1 on `#FF8080`, short of
  4.5:1. They only show under the pointer, since keyboard focus keeps the normal
  fills. `themes/craft.test.ts` holds these two values, so changing them is deliberate.
- **Muted text.** The reference's description gray (`#B1B2B5`) reaches only 4.2:1 on
  `#48494A`, so CraftUI uses `#D0D1D4`.
- **Indeterminate checkboxes and the taller progress bar.** These aren't in the
  reference. They're additions for the web.
- **Highlighted menu rows.** The reference shows open lists without a highlighted
  row, so a highlighted row is `#6D6D6E`, a step lighter than the row.
- **Destructive menu items.** Red text on a gray row falls below 4.5:1, so it's
  `#FFC2C2`, and the row turns red when highlighted.
- **Item slots.** Ore UI's published screens don't show an inventory, so slots
  follow its recessed fields and its selected tiles: a sunken square, shaded along the
  top and left, with a green frame when selected. Disabled slots are hatched, so
  they differ in more than color.
- **Ping and favorites.** The ping bars and the favorite star use `--craft-signal-*`
  and `--craft-favorite`, which hold 3:1 against a row.
- **Toasts.** Toasts take the message bars' colors, with an outline added so they stand
  apart from the page beneath. Success and error use the primary and destructive fills.

## One design

Ore UI is one design: dark menus, with light surfaces only as individual elements,
such as secondary buttons, dropdowns and the Play screen's top bar. CraftUI follows
it, with no light or dark mode. Every value is on `:root`, and `themes/craft.test.ts`
fails if a `.dark` block comes back.

## Type

Ore UI uses Mojangles and Minecraft Ten, which aren't available to distribute. CraftUI
uses **Departure Mono** by Helena Zhang (SIL Open Font License) for labels. Like
Mojangles, it's a thin, wide pixel face. At 22 pixels its capitals are 14 pixels tall,
which is 7 units, matching the reference. It's drawn on an 11-pixel grid, so CraftUI
only uses multiples of 11 pixels for it. **Noto Sans** (also SIL OFL) is used for long
text, as the references do.

The official font file and its license are in `packages/departure-mono`. There's no
official package on npm, and it isn't on Google Fonts, so the CraftUI site serves that
package as a tarball, and the theme item installs it and adds
`@import "@runqora/departure-mono"`. The shadcn CLI can't write an `@font-face` rule
into a project's CSS, and an `@import` of a URL would land after Tailwind's rules,
where browsers ignore it. A package import is inlined, so it works anywhere. See
`packages/tooling/src/font-package.ts` for how to change the package.

The reference's heavy Hero label has no free match, so the `hero` button uses Departure
Mono in capitals with the measured drop shadow (`#2A5D1B`).

## Recording new measurements

For a new component, find its control in the reference, scan one line of pixels through
it, and read off each run of a single color. Divide the run lengths by the image's unit
size, and record them here.
