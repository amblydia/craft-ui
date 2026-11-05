# Security

CraftUI is source code that you copy into your own project, and it runs no service
of its own. The main things that could go wrong are a vulnerability in a component
or a tampered registry item.

## Reporting a problem

Please report it privately through
[GitHub security advisories](https://github.com/amblydia/craft-ui/security/advisories/new),
not in a public issue. Include what you found and how to reproduce it. We'll reply as
soon as we can and credit you if you'd like.

## Supported versions

CraftUI is installed as source, so fixes land in the registry on `main`. To pick one
up, re-add the component and review the difference:

```bash
bunx shadcn@latest add @runqora/craft-button --diff
```

## Good to know

- Registry items are plain source code. Review what you install, as you would with
  any dependency.
- Items are served over HTTPS from `craftui.runqora.dev`, and through `runqora.dev`.
