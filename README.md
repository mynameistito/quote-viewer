# quote-viewer

A cross-browser MV3 extension that brings back the "view quote tweets" button on twitter.com / x.com. Rewritten in TypeScript on top of [WXT](https://wxt.dev/).

This extension was created to minimize the number of closed-source extensions I was using.

Originally forked from: [View Quote Tweets on Twitter - QuickQuotes](https://chromewebstore.google.com/detail/view-quote-tweets-on-twit/ebjigpojdkoclfidpgjkcgmdnjlajgej)

## Setup

```bash
bun install
```

## Build & package

```bash
bun run build            # chrome
bun run build:firefox    # firefox
bun run zip:all          # produces .output/quote-viewer-<v>-{chrome,firefox}.zip
```

## Linting / formatting

[Ultracite](https://ultracite.dev) on top of `oxlint` + `oxfmt`:

```bash
bun run check
bun run fix
```

## Releases

Versioning is managed with [Changesets](https://github.com/changesets/changesets). After landing changes:

```bash
bun run changeset       # describe the change
```

## License

[MIT](LICENSE)
