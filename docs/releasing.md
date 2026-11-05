# Releasing

CraftUI has no package to publish. A release is whatever's on `main` once it's deployed,
because the registry serves the latest source. So a "release" mostly means telling
people what changed.

1. Make sure CI is green on `main`, including the install matrix.
2. Move the `Unreleased` entries in `CHANGELOG.md` under a new version and date. Do the
   same in `apps/web/content/docs/changelog.mdx`.
3. Commit, then tag it: `git tag v0.2.0 && git push origin v0.2.0`.
4. Deploy (see [deployment.md](deployment.md)), and check that the registry serves the
   new items.
5. Create a GitHub release from the tag, with the changelog entry as its notes.

## Versioning

Versions follow the spirit of semantic versioning, applied to what a developer re-adding
a component would see:

- **Patch:** a fix, with no change to props or tokens.
- **Minor:** new components, props or tokens.
- **Major:** a renamed or removed prop or token, or a change that needs a developer to
  edit their code. Say so plainly in the changelog, with how to migrate.

Since components are copied into projects, nothing changes for anyone until they re-add
a component, and they can review the difference with `shadcn add <item> --diff`.

## Keep the theme item in sync

`craft-theme` is built from `packages/registry/themes/craft.css`. Adding a token adds it
to projects on their next `shadcn add`, but removing one doesn't remove it from their CSS.
Treat removals as breaking.
