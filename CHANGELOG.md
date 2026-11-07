# Changelog

CraftUI is installed as source, so a release never changes anyone's code by itself.
Entries here say what's new in the registry. See
[docs/releasing.md](docs/releasing.md) for how releases work.

## Unreleased

The first set of components, not yet announced.

### Changed

- **Compared against every Ore UI reference:** Tabs, Checkbox, Switch, Slider, Input,
  Panel, Dialog, Tooltip, Progress and Scroll Area now follow the measured states and
  structure. See `docs/design-reference.md`.
- **Font:** labels use Departure Mono, which the theme installs as the
  `@runqora/departure-mono` package
- **Panel:** flat by default. Add `framed` for the outlined look
- **Progress:** thin by default. `size="md"` is the taller bar
- **Scroll Area:** has no frame of its own
- **Controls:** the medium height is now 48px, and the large height 56px
- **Primary and hero buttons:** the label stays white on hover, as in Ore UI's
  reference, and the hero label's shadow follows each state's green
- **Disabled controls:** the label is `#48494A`, as in the reference
- **One design:** Ore UI has no light or dark mode, so neither does CraftUI. The
  theme's values are all on `:root`, the components look the same whatever the
  page's color scheme, and the site has no theme switch. If you installed earlier,
  delete the `--craft-` variables under `.dark` in your CSS
- **Hover labels:** the destructive button's label stays white on hover too, as in
  the reference
- **Checked against every Ore UI design system image:** Checkbox is 13 units
  with the reference's tick, Radio is 14 units corner to corner, the switch's
  marks and the select's chevron take the reference colors, a dialog's back and
  close icons are drawn with one-unit strokes, and a disabled tab looks like the
  others

### Added

- **Advanced components:** Select, Combobox, Dropdown Menu, Context Menu, Radio
  Group, Accordion, Toast, Popover, Navigation Menu, Pagination, Table, Badge and
  Spinner, measured from Ore UI's dropdown, radio, tag, list and message references
  where it has them
- **Game components:** Item Slot, Inventory Grid, Hotbar, Server List, World List,
  Profile Panel and Settings Menu, following Ore UI's world, server, profile and
  settings screens. They take your app's data and handlers, and never call a game
- **Theme:** colors for item slots, ping signal and favorites
- **Blocks:** Main Menu, Settings Screen, Server Browser, World Browser, Inventory
  Screen, Profile Screen, Confirmation Dialog, Game Dashboard, Multiplayer Lobby
  and Marketplace, laid out as Ore UI's screens, in a gallery at `/blocks` to
  preview, copy and install, and each on a page of its own at `/view/{name}`
- **Screen:** the frame the blocks share, with Ore UI's light top bar and titled
  sections
- **Server List:** `onSelect` and `selected`, to show a server's details beside the
  list
- **Theme:** colors for the top bar of a screen
- **Button:** the `hero` variant
- **Slider:** `showSteps`, which marks each step with a notch
- **Dialog:** `DialogBack`

### Fixed

- **Tabs:** pressing an unselected tab sinks it under the pointer, instead of
  showing its hover color, and the focus ring is no longer clipped by the tab bar
- **Toggle buttons:** long labels wrap instead of being cut off
- **Slider:** the fill no longer covers the track's bottom outline

### Added

- **Components:** Button, Input, Checkbox, Switch, Slider, Progress, Tabs, Panel,
  Dialog, Tooltip, Separator and Scroll Area
- **Theme:** the `craft-theme` tokens, measured from published Ore UI references
- **Registry:** valid shadcn registry items at `/r/{name}.json` and
  `/r/{style}/{name}.json`
- **Docs:** the Fumadocs site, with live previews and interactive examples
- **Tooling:** registry validation, and an install test that uses the real shadcn CLI
  in brand new Next.js and Vite projects
