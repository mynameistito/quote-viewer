---
"quote-viewer": patch
---

Fix `scripts/publish-release.ts` failing to find built extension zips. `Bun.Glob.scan` defaults to `dot: false`, which skipped the `.output/` directory because it starts with a dot. Pass `dot: true` so the `.output/*.zip` glob matches the chrome and firefox bundles produced by `wxt zip`.
