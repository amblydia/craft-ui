# CraftUI examples

Small apps showing the components together: a settings screen, a world's options,
and an inventory with a hotbar.

| Example | Stack |
|---|---|
| [`nextjs`](nextjs) | Next.js App Router, with Noto Sans from `next/font` |
| [`vite`](vite) | Vite and React, with Noto Sans from Fontsource |

To run one:

```bash
cd examples/vite
bun install
bun run dev
```

They're separate from the main workspace, so they install and run the way your own
project would.

`shared/playground.tsx` is the screen itself, and the docs site's
[playground](https://craftui.runqora.dev/docs/playground) uses it too. To regenerate the
apps from scratch with the real shadcn CLI, run `bun run examples:sync` from the
repository root. Don't edit their `components/craft` folders by hand.
