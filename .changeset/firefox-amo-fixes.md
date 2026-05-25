---
"quote-viewer": patch
---

Fix Firefox AMO validation issues:

- Add required `browser_specific_settings.gecko.data_collection_permissions` (set to `["none"]`) to the Firefox manifest.
- Resolve "Unsafe assignment to innerHTML" warning by building the quote-icon SVG via `createElementNS` instead of assigning an HTML string to `innerHTML`.
