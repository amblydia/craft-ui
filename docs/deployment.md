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

GitHub Actions builds the image, so Coolify only pulls and runs it, as it does for
`runqora.dev`.

1. Create an application in the Runqora project, with the Docker Image build pack.
2. Set the image to `ghcr.io/amblydia/craft-ui`, with the tag `latest`.
3. Set the port to `3000`, and the health check path to `/api/health`.
4. Set the domain to `https://craftui.runqora.dev`.

## Set up DNS

In Cloudflare, add an `A` record for `craftui` on the `runqora.dev` zone, pointing at the
VPS. Allow `/r/*` to be fetched by command-line clients, because the shadcn CLI isn't a
browser: a bot challenge on those paths would break installs.

## Deploy from GitHub Actions

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the image, pushes
it to GHCR and asks Coolify to redeploy, using the shared workflow from
`Amblydia/github-actions`. You can also run it by hand. It needs two repository secrets:

- `COOLIFY_WEBHOOK`: the application's deploy webhook
- `COOLIFY_TOKEN`: an API token with deploy permission

Without them, the image is still pushed, but the final Coolify step fails.

## After the first deployment

Follow the roll-out in [runqora-integration.md](runqora-integration.md) to connect the
`@runqora` namespace.
