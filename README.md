# CraftUI

Minecraft-inspired components for React.

CraftUI is a free, open-source set of React components inspired by the look of
Minecraft Bedrock's modern Ore UI. Install them with the shadcn CLI, own the
source, and use them in any React app with Tailwind CSS v4.

**[Documentation](https://craftui.runqora.dev)** ·
**[Components](https://craftui.runqora.dev/docs/components/button)** ·
**[Sponsor](https://github.com/sponsors/jeantkg)**

> CraftUI is an independent, unofficial project. It is not affiliated with,
> endorsed by or sponsored by Mojang Studios or Microsoft. Minecraft is a trademark
> of Mojang Synergies AB. CraftUI ships no Minecraft textures, fonts, icons, sounds
> or code.

CraftUI is **not** a Bedrock JSON UI library, a game mod, a resource pack or a
change to the Minecraft client. It's a set of web components.

## Install a component

Add the registry once, then add what you need.

```bash
bunx shadcn@latest registry add @runqora=https://runqora.dev/r/{style}/{name}.json
bunx shadcn@latest add @runqora/craft-button
```

```tsx
import { Button } from "@/components/craft/button";

export function Play() {
  return <Button>Play</Button>;
}
```

Components install to `components/craft`, and every token starts with `craft`, so
CraftUI works beside your existing shadcn/ui components and theme.

## What's available

**Core components:** Button, Input, Checkbox, Switch, Slider, Progress, Tabs, Panel,
Dialog, Tooltip, Separator and Scroll Area.

**Advanced components:** Select, Combobox, Dropdown Menu, Context Menu, Radio Group,
Accordion, Toast, Popover, Navigation Menu, Pagination, Table, Badge and Spinner.

**Game components:** Item Slot, Inventory Grid, Hotbar, Server List, World List,
Profile Panel and Settings Menu.

**Blocks:** Main Menu, Settings Screen, Server Browser, World Browser, Inventory
Screen, Profile Screen, Confirmation Dialog, Game Dashboard, Multiplayer Lobby and
Marketplace: whole screens that take your data and handlers. See the
[blocks](https://craftui.runqora.dev/blocks).

## Relationship with Runqora

CraftUI is part of the [Runqora](https://runqora.dev) family but stands on its own:
its own repository, website, design system, tests, releases and issues. It shares
Runqora's `@runqora` registry namespace, so developers only add one registry.
[docs/runqora-integration.md](docs/runqora-integration.md) explains how the two
connect.

## Run it locally

You'll need [Bun](https://bun.sh).

```bash
bun install
bun run dev
```

The site runs at <http://localhost:3000>.

| Command | What it does |
|---|---|
| `bun run check` | Lint, format and types |
| `bun run test` | Unit tests |
| `bun run build` | Build the registry and the site |
| `bun run test:e2e` | The built site in a real browser, with accessibility checks and, on Linux, screenshot comparisons |
| `bun run test:install --template next --browser` | Install every component into a brand new project and try it out |

## Repository layout

```text
apps/web/             The Fumadocs site at craftui.runqora.dev, which serves the registry
packages/registry/    Component source, tests, the theme and registry.json
packages/tooling/     Builds, validates and install-tests the registry
packages/config/      Shared TypeScript configuration
examples/             Small apps with components installed by the CLI
docker/               The production image
docs/                 Notes for maintainers
```

## Contributing

Bug reports, fixes and new components are welcome. See
[CONTRIBUTING.md](CONTRIBUTING.md).

## Sponsoring

Every component is free. There's no paid tier, account or license key, and there
never will be. CraftUI is funded only by
[sponsorships](https://github.com/sponsors/jeantkg), which never affect who can
use what.

## Fonts

Labels use [Departure Mono](https://departuremono.com/) by Helena Zhang, under the SIL
Open Font License. The font file and its license are in
[`packages/departure-mono`](packages/departure-mono).

## License

[MIT](LICENSE), for the original code and assets in this repository. "Minecraft" and
related names belong to their owners.
