#!/usr/bin/env bun
/**
 * Creates a GitHub Release for the current `package.json` version and uploads
 * the built extension zips from `.output/` as release assets.
 *
 * Intended to be run from CI after `bun run release` has produced the zips
 * and `changeset tag` has pushed the `v<version>` tag. Requires the `gh` CLI
 * to be authenticated (the GitHub Actions runner provides this via
 * `GH_TOKEN`/`GITHUB_TOKEN`).
 *
 * If the release already exists (e.g. a retry), assets are uploaded with
 * `--clobber` instead of failing.
 */
import { Glob } from "bun";

import pkg from "../package.json" with { type: "json" };

const tag = `v${pkg.version}`;

// `dot: true` is required because `.output/` starts with a dot and Bun's
// Glob.scan ignores dotfiles/dirs by default.
const zips = await Array.fromAsync(
  new Glob(".output/*.zip").scan({ cwd: ".", dot: true })
);
if (zips.length === 0) {
  console.error(
    "No zips found in .output/. Did `bun run zip:all` run successfully?"
  );
  process.exit(1);
}

console.log(`Publishing release ${tag} with ${zips.length} asset(s):`);
for (const z of zips) {
  console.log(`  - ${z}`);
}

const exists =
  Bun.spawnSync({
    cmd: ["gh", "release", "view", tag],
    stderr: "ignore",
    stdout: "ignore",
  }).exitCode === 0;

const proc = exists
  ? Bun.spawnSync({
      cmd: ["gh", "release", "upload", tag, ...zips, "--clobber"],
      stderr: "inherit",
      stdout: "inherit",
    })
  : Bun.spawnSync({
      cmd: [
        "gh",
        "release",
        "create",
        tag,
        ...zips,
        "--title",
        tag,
        "--generate-notes",
      ],
      stderr: "inherit",
      stdout: "inherit",
    });

if (proc.exitCode !== 0) {
  console.error(`gh release ${exists ? "upload" : "create"} failed.`);
  process.exit(proc.exitCode ?? 1);
}

console.log(
  `\n✔ Release ${tag} ready: https://github.com/${process.env.GITHUB_REPOSITORY ?? "<owner>/<repo>"}/releases/tag/${tag}`
);
