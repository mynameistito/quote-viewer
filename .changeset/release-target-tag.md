---
"quote-viewer": patch
---

Fix `gh release create` failing with "tag … exists locally but has not been pushed". `changeset tag` only creates the tag locally; previously the changesets/action push happened as a side effect of its default `createGithubReleases: true` (the GitHub Release API auto-creates missing tags). Now that we own release creation, pass `--target $GITHUB_SHA` to `gh release create` so the tag is created on the server at the workflow's commit.
