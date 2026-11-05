# Contributing to CraftUI

Thanks for helping. Bug reports, fixes and new components are all welcome. For
anything large, open an issue first so we can agree on the shape of it.

## Set up

You'll need [Bun](https://bun.sh), plus [Node](https://nodejs.org) 22 or newer for
the browser tests.

```bash
bun install
bun run dev
```

## Where things live

| Path | What's there |
|---|---|
| `packages/registry/components` | Component source and tests |
| `packages/registry/themes/craft.css` | The theme, the only place tokens are defined |
| `packages/registry/registry.json` | What each registry item contains |
| `packages/tooling` | Builds, validates and install-tests the registry |
| `apps/web/content/docs` | The docs, in MDX |
| `apps/web/components/demos` | The live examples in the docs |
| `examples` | Small apps with components installed by the CLI |

## Add a component

1. Write `packages/registry/components/<name>.tsx`, with
   `<name>.test.tsx` beside it.
2. Add `craft-<name>` to `packages/registry/registry.json`, listing every package
   and registry item it imports. The registry build fails if one is missing.
3. Add demos to `apps/web/components/demos`, and a page at
   `apps/web/content/docs/components/<name>.mdx`, with the sections the other pages
   have: Installation, Usage, Props, Accessibility, Customization, Dependencies and
   Source.

## Component rules

- Build on [Base UI](https://base-ui.com) wherever it has a primitive.
- Take every color and size from a `--craft-*` token, so that theming works.
- Must not depend on Next.js, a hosted service or application logic.
- Work with the keyboard, have an accessible name, and show state in more than
  color alone.
- Respect reduced motion, and keep animations short and purposeful.
- Keep the source easy to read, because it becomes someone else's code.

## Assets and licensing

Contributions are licensed under MIT. Only add what you have the right to
distribute. **Don't add Minecraft textures, fonts, icons, sounds or code, even as
placeholders**, and don't put art taken from the game in screenshots or examples.
Measuring a color from a public reference is fine. Copying an image isn't.

## Before you open a pull request

```bash
bun run check
bun run test
bun run build
bun run test:e2e
```

If you changed the registry or a dependency, also run:

```bash
bun run test:install --template next --browser
bun run test:install --template vite --browser
```

Those create a brand new project, install every component with the real shadcn CLI
and try them in a browser. Please describe what you tested in the pull request.

## Code of conduct

This project follows the [Code of Conduct](CODE_OF_CONDUCT.md).
