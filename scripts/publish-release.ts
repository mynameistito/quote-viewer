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
 * If a release already exists for this tag (e.g. an empty release left
 * behind by a previous failed run, or one auto-created by another workflow),
 * we delete it first and re-create it with the assets attached. This is
 * required because the repo uses GitHub Immutable Releases — existing
 * releases cannot be mutated, only replaced. Deleting the release leaves
 * the git tag in place, so `gh release create` reuses it.
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

if (exists) {
  console.log(
    `Release ${tag} already exists; deleting it so we can recreate with assets (Immutable Releases blocks in-place edits).`
  );
  const del = Bun.spawnSync({
    // --cleanup-tag=false (the default) keeps the v<version> git tag intact.
    cmd: ["gh", "release", "delete", tag, "--yes"],
    stderr: "inherit",
    stdout: "inherit",
  });
  if (del.exitCode !== 0) {
    console.error(`gh release delete failed for ${tag}.`);
    process.exit(del.exitCode ?? 1);
  }
}

const create = Bun.spawnSync({
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

if (create.exitCode !== 0) {
  console.error("gh release create failed.");
  process.exit(create.exitCode ?? 1);
}

console.log(
  `\n✔ Release ${tag} ready: https://github.com/${process.env.GITHUB_REPOSITORY ?? "<owner>/<repo>"}/releases/tag/${tag}`
);
