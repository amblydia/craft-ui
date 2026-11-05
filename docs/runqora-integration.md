# Integrating with Runqora's registry

The goal is for `shadcn add @runqora/craft-button` to work, while CraftUI stays its own
project with its own site and releases. **This hasn't been applied yet.** It's a change
to `amblydia/runqora-ui`, to be reviewed and made there.

## How Runqora's registry works

From reading `amblydia/runqora-ui` at commit `7d4d4be`:

- `@runqora` points at `https://runqora.dev/r/{style}/{name}.json`.
- `scripts/build-registry.ts` writes static JSON to `public/r/radix` and
  `public/r/base`, because Runqora's components differ per primitive library.
- `next.config.mjs` uses `beforeFiles` rewrites to send `/r/base-*/:name` to the Base UI
  build and other styles to the Radix build.
- `@runqora` is **not** in shadcn's public registry index, so developers add it with
  `shadcn registry add` first.

## What CraftUI provides

CraftUI builds valid registry items on its own, served from its own site, with no
dependency on Runqora at build time or at run time:

```text
https://craftui.runqora.dev/r/registry.json
https://craftui.runqora.dev/r/craft-button.json
https://craftui.runqora.dev/r/{style}/craft-button.json   (the same file, for any style)
```

- Items depend on Base UI directly, so one build serves Radix and Base UI projects.
- Items refer to each other by absolute URL, such as
  `https://craftui.runqora.dev/r/craft-theme.json`. They resolve the same way however
  the first item was reached: through `@runqora`, by direct URL, or from a fork
  (`REGISTRY_URL` changes the base at build time).

## The integration: a proxy rewrite

Add two rules at the **top** of the `beforeFiles` list in Runqora's `next.config.mjs`,
ahead of its existing rules:

```js
rewrites() {
  return {
    beforeFiles: [
      // CraftUI publishes its own items. See amblydia/craft-ui.
      {
        destination: "https://craftui.runqora.dev/r/:name",
        source: "/r/:style/:name(craft-[^/]+\\.json)",
      },
      {
        destination: "https://craftui.runqora.dev/r/:name",
        source: "/r/:name(craft-[^/]+\\.json)",
      },
      // ...the existing rules
    ],
  };
},
```

The result:

```text
shadcn add @runqora/craft-button
  → GET runqora.dev/r/base-nova/craft-button.json
  → proxied to craftui.runqora.dev/r/craft-button.json
```

### Why this approach

| Option | Trade-off |
|---|---|
| **Proxy rewrite (chosen)** | Two lines, no sync job, and a CraftUI release is live immediately. The cost is a runtime dependency on CraftUI's site, for `craft-*` paths only. |
| Copy artifacts at Runqora's build time | No runtime dependency, but each CraftUI release needs a Runqora deploy, and a broken fetch could fail Runqora's build. |
| CI publishes into Runqora's repo | Generated commits and token handling, for no benefit to developers. |

Non-`craft-*` paths never touch CraftUI, so if CraftUI's site goes down, Runqora's own
components keep working. CraftUI's items could also still be installed by direct URL
from a mirror, since they're static files.

### Optional: list CraftUI in `@runqora`'s index

The rewrite makes `add` work, but `shadcn search @runqora` reads Runqora's own
`registry.json`, which won't list `craft-*` items. To include them, Runqora's
`build-registry.ts` could merge `https://craftui.runqora.dev/r/registry.json` into its
index at build time, falling back to Runqora's items alone if the fetch fails. It's not
needed for installs, so it can wait.

## Roll-out order

1. Deploy CraftUI to `craftui.runqora.dev` (see [deployment.md](deployment.md)).
2. Check that `https://craftui.runqora.dev/r/base-nova/craft-button.json` returns JSON.
3. Add the rewrite to `runqora-ui` and deploy it.
4. In a clean project, confirm it end to end:

   ```bash
   bunx shadcn@latest registry add @runqora=https://runqora.dev/r/{style}/{name}.json
   bunx shadcn@latest add @runqora/craft-button
   ```

## What's been tested

`bun run test:install` runs the real shadcn CLI against a local server with the same URL
shape as the proxy (`/r/{style}/{name}.json`), through the `@runqora` namespace. It
doesn't exercise Runqora's actual `next.config.mjs` or production hosts, so run step 4
above after deploying.

## The public index

`@runqora` isn't listed in [shadcn's registry index](https://ui.shadcn.com/docs/registry/registry-index),
and the maintainers have decided not to list it yet. Until then, developers need the
`shadcn registry add` step above.
