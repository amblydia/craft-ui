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

## Release a new version

Pushing to `main` doesn't publish or deploy anything. Both steps are done by hand:

1. Publish the image to GHCR, using the shared workflow from `Amblydia/github-actions`:

   ```bash
   gh workflow run publish.yml --repo amblydia/craft-ui
   ```

2. Once that finishes, redeploy the application in Coolify, which pulls the new `latest`.

The image is public, so anyone can pull it without logging in.

## After the first deployment

Follow the roll-out in [runqora-integration.md](runqora-integration.md) to connect the
`@runqora` namespace.
