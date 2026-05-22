---
"quote-viewer": patch
---

Fix release workflow so GitHub Releases include the built Chrome and Firefox extension zips.

Replaces the broken `createGithubReleases: true` + separate upload steps with a single `scripts/publish-release.ts` (exposed as `bun run publish-release`) that creates the release with the `.output/*.zip` assets attached, or uploads to an existing release on re-run.
