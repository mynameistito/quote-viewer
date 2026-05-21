# quote-viewer

A cross-browser MV3 extension that brings back the "view quote tweets" button on twitter.com / x.com. Rewritten in TypeScript on top of [WXT](https://wxt.dev/).

This Extension was created with the intention of minimising the number of closed sourced extensions I was utilsing.

Originally forked from: [View Quote Tweets on Twitter - QuickQuotes](https://chromewebstore.google.com/detail/view-quote-tweets-on-twit/ebjigpojdkoclfidpgjkcgmdnjlajgej)

## Setup

```bash
bun install
```

### Persistent extension ID (`key.pem`)

[wxt.config.ts](./wxt.config.ts) reads `key.pem` from the repo root and derives the SPKI public key into `manifest.key`, so the unpacked extension always loads under the same Chromium ID. The file is **gitignored**.

Generate one (requires `openssl` on PATH):

```bash
bun run gen-key
```

The script writes `key.pem` and prints the resulting extension ID + `gh` command to register the same key with CI.

#### Registering the key in CI

The release workflow signs Chromium builds with `WXT_CHROME_KEY` (the raw private-key PEM). Register it once:

```bash
gh secret set WXT_CHROME_KEY < key.pem
```

(or via GitHub UI → Settings → Secrets and variables → Actions → New repository secret, name `WXT_CHROME_KEY`, value = full contents of `key.pem` including `-----BEGIN/END-----` lines).

Firefox builds use `browser_specific_settings.gecko.id` and need no secret.

## Development

```bash
bun run dev              # launch chrome with the unpacked extension
bun run dev:firefox      # same, in firefox
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

On push to `main`, the workflow in `.github/workflows/release.yml` opens (or merges) a "Version Packages" PR. Merging it bumps `package.json`, tags, runs `bun run release` (which builds & zips both browsers), and uploads `quote-viewer-<v>-chrome.zip` + `quote-viewer-<v>-firefox.zip` to a new GitHub Release.

`WXT_CHROME_KEY` must be set as a repo secret so the released Chromium build is signed with the persistent key.

## License

[MIT](LICENSE)
