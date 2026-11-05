# Changelog

CraftUI is installed as source, so a release never changes anyone's code by itself.
Entries here say what's new in the registry. See
[docs/releasing.md](docs/releasing.md) for how releases work.

## Unreleased

The first set of components, not yet announced.

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
