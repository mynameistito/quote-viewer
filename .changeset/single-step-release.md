---
"quote-viewer": patch
---

Collapse the release pipeline into a single CI step. `bun run release` now chains `zip:all && changeset tag && publish-release`, so `changesets/action` runs the whole release end-to-end (build + tag + GitHub Release with assets). Removes the separate "Create GitHub Release with extension zips" step from the workflow and the brittle coordination between it and the action's `published` output. Also passes `--target $GITHUB_SHA` to `gh release create` so the tag is created server-side without needing runner git-push credentials.
