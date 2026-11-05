# syntax=docker/dockerfile:1

# The docs site, which also serves the registry at /r/{name}.json and
# /r/{style}/{name}.json. Build from the repository root:
#
#   docker build -f docker/Dockerfile -t craft-ui .
#
# `checks` is a validation stage for CI and is not part of the image.

# ---- Base ------------------------------------------------------------------
FROM oven/bun:1.3 AS base
WORKDIR /app

# ---- Manifests -------------------------------------------------------------
# Only the files that decide what gets installed, so the install below stays
# cached when only source changes.
FROM base AS manifests
COPY . /src
RUN cd /src \
 && find . -name package.json -not -path "*/node_modules/*" -not -path "./examples/*" \
      -exec sh -c 'mkdir -p "/out/$(dirname "$1")" && cp "$1" "/out/$1"' _ {} \; \
 && cp bun.lock /out/

# ---- Dependencies ----------------------------------------------------------
FROM base AS deps
COPY --from=manifests /out/ ./
RUN bun install --frozen-lockfile

# ---- Checks (lint, formatting, types) --------------------------------------
FROM deps AS checks
COPY . .
RUN bun run check

# ---- Build -----------------------------------------------------------------
# Next.js builds on Node, as it runs below. Bun starts the scripts and hands
# over to the real `node`.
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=base /usr/local/bin/bun /usr/local/bin/bun
COPY --from=deps /app ./
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run --cwd apps/web build

# ---- Runtime ---------------------------------------------------------------
FROM node:22-alpine AS web
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Standalone output mirrors the workspace: the server is at apps/web/server.js.
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
# Standalone output leaves public/ out, and public/ holds the built registry.
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "apps/web/server.js"]
