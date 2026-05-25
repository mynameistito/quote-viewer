# quote-viewer

## 0.2.1

### Patch Changes

- 9dfad14: Fix icon showing gray box without hover and white circle on hover, fix pending-article retry missing nested action bars

## 0.2.0

### Minor Changes

- 768e468: Open x.com instead of twitter.com on extension install

### Patch Changes

- cdbbea1: Fix quote icon not appearing on timeline and profile pages

## 0.1.5

### Patch Changes

- 51fc23e: Update CICD Release Script and Pipeline

## 0.1.4

### Patch Changes

- 182ae19: Collapse the release pipeline into a single CI step. `bun run release` now chains `zip:all && changeset tag && publish-release`, so `changesets/action` runs the whole release end-to-end (build + tag + GitHub Release with assets). Removes the separate "Create GitHub Release with extension zips" step from the workflow and the brittle coordination between it and the action's `published` output. Also passes `--target $GITHUB_SHA` to `gh release create` so the tag is created server-side without needing runner git-push credentials.

## 0.1.3

### Patch Changes

- d416731: Disable `changesets/action`'s default `createGithubReleases: true` so it no longer races our `publish-release` step by creating an empty (and, under GitHub Immutable Releases, unmodifiable) release first. Our script now owns release creation and atomically attaches the chrome + firefox zips.

  For robustness, `scripts/publish-release.ts` also now deletes a pre-existing release for the same tag and recreates it with assets, since Immutable Releases blocks in-place edits. Also adds a manual `Upload Release Assets` workflow to backfill historical releases (e.g. v0.1.1, v0.1.2) using the same delete-then-recreate flow.

## 0.1.2

### Patch Changes

- f816276: Fix `scripts/publish-release.ts` failing to find built extension zips. `Bun.Glob.scan` defaults to `dot: false`, which skipped the `.output/` directory because it starts with a dot. Pass `dot: true` so the `.output/*.zip` glob matches the chrome and firefox bundles produced by `wxt zip`.

## 0.1.1

### Patch Changes

- 2ae9d9f: Fix release workflow so GitHub Releases include the built Chrome and Firefox extension zips.

  Replaces the broken `createGithubReleases: true` + separate upload steps with a single `scripts/publish-release.ts` (exposed as `bun run publish-release`) that creates the release with the `.output/*.zip` assets attached, or uploads to an existing release on re-run.

## 0.1.0

### Minor Changes

- 36ae54d: Initial rewrite of original Chrome extension.
