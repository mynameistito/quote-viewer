---
"quote-viewer": patch
---

Disable `changesets/action`'s default `createGithubReleases: true` so it no longer races our `publish-release` step by creating an empty (and, under GitHub Immutable Releases, unmodifiable) release first. Our script now owns release creation and atomically attaches the chrome + firefox zips.

For robustness, `scripts/publish-release.ts` also now deletes a pre-existing release for the same tag and recreates it with assets, since Immutable Releases blocks in-place edits. Also adds a manual `Upload Release Assets` workflow to backfill historical releases (e.g. v0.1.1, v0.1.2) using the same delete-then-recreate flow.
