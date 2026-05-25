---
"quote-viewer": patch
---

Bump Firefox `strict_min_version` from `109.0` to `140.0` so AMO no longer warns that the previously-required `data_collection_permissions` key is unsupported by the declared minimum version (it was added in Firefox 140). Firefox-only change; Chrome manifest is unchanged. The extension is not targeted at Firefox for Android, so the equivalent Android warning is intentionally not addressed.
