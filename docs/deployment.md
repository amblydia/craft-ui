# Deployment

CraftUI's site and registry run as one Next.js container on our VPS, at
`craftui.runqora.dev`:

```text
Cloudflare DNS → VPS → Coolify → Docker → Next.js (standalone)
```

The site needs no database, accounts or secrets at runtime.

## Build the image

From the repository root:

```bash
docker build -f docker/Dockerfile -t craft-ui .
docker run --rm -p 3000:3000 craft-ui
```

Then check it:

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/r/base-nova/craft-button.json
```

## Environment

All are optional, and all are read at **build** time.

| Variable | Default | Purpose |
|---|---|---|
| `REGISTRY_URL` | `https://craftui.runqora.dev` | The base URL in registry items' dependencies |
| `NEXT_PUBLIC_SITE_URL` | `https://craftui.runqora.dev` | Canonical URLs and the sitemap |

Pass them with `--build-arg` only if the Dockerfile declares them, as a fork might need
to. See `.env.example`.

## Set up Coolify

1. Create an application from `amblydia/craft-ui`, with the Dockerfile build pack.
2. Set the Dockerfile location to `/docker/Dockerfile`, and the base directory to `/`.
3. Set the port to `3000`, and the health check path to `/api/health`.
4. Set the domain to `https://craftui.runqora.dev`.

## Set up DNS

In Cloudflare, add an `A` record for `craftui` on the `runqora.dev` zone, pointing at the
VPS. Allow `/r/*` to be fetched by command-line clients, because the shadcn CLI isn't a
browser: a bot challenge on those paths would break installs.

## Deploy from GitHub Actions

`.github/workflows/deploy.yml` builds the image, pushes it to GHCR and asks Coolify to
redeploy, using the shared workflow from `Amblydia/github-actions`. It's run by hand for
now. It needs two repository secrets:

- `COOLIFY_WEBHOOK`: the application's deploy webhook
- `COOLIFY_TOKEN`: an API token with deploy permission

Once the first deployment is healthy, add a `push` trigger on `main` to deploy on every
merge, as `runqora-ui` does.

## After the first deployment

Follow the roll-out in [runqora-integration.md](runqora-integration.md) to connect the
`@runqora` namespace.
