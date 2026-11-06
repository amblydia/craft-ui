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

### Added

- **Button:** the `hero` variant
- **Slider:** `showSteps`, which marks each step with a notch
- **Dialog:** `DialogBack`

### Added

- **Components:** Button, Input, Checkbox, Switch, Slider, Progress, Tabs, Panel,
  Dialog, Tooltip, Separator and Scroll Area
- **Theme:** the `craft-theme` tokens for light and dark, measured from published
  Ore UI references
- **Registry:** valid shadcn registry items at `/r/{name}.json` and
  `/r/{style}/{name}.json`
- **Docs:** the Fumadocs site, with live previews and interactive examples
- **Tooling:** registry validation, and an install test that uses the real shadcn CLI
  in brand new Next.js and Vite projects
