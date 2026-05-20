#!/usr/bin/env bun
/**
 * Generates a fresh PKCS8 RSA-2048 private key (`key.pem`) using openssl,
 * then prints the derived SPKI public key (what Chromium uses for
 * `manifest.key` → persistent extension ID) plus the resulting extension ID.
 *
 * Run once per repo. The file is gitignored.
 */
import { createHash, createPublicKey } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

const KEY_PATH = "key.pem";

if (existsSync(KEY_PATH)) {
  console.error(
    `Refusing to overwrite existing ${KEY_PATH}. Delete it first if you really mean to rotate the extension ID.`
  );
  process.exit(1);
}

const proc = Bun.spawnSync({
  cmd: [
    "openssl",
    "genpkey",
    "-algorithm",
    "RSA",
    "-out",
    KEY_PATH,
    "-pkeyopt",
    "rsa_keygen_bits:2048",
  ],
  stderr: "inherit",
  stdout: "inherit",
});

if (proc.exitCode !== 0) {
  console.error("openssl failed. Is it on PATH? (try a new shell)");
  process.exit(proc.exitCode ?? 1);
}

const pem = readFileSync(KEY_PATH, "utf-8");
const spkiPem = createPublicKey(pem).export({
  format: "pem",
  type: "spki",
}) as string;

const spkiB64 = spkiPem
  .replaceAll("-----BEGIN PUBLIC KEY-----", "")
  .replaceAll("-----END PUBLIC KEY-----", "")
  .replaceAll(/\s+/gu, "");

// Chromium extension ID: sha256(SPKI DER) → take first 16 bytes → map 0-f to a-p
const spkiDer = Buffer.from(spkiB64, "base64");
const digest = createHash("sha256").update(spkiDer).digest("hex").slice(0, 32);
const extensionId = [...digest]
  .map((c) => String.fromCodePoint(97 + Number.parseInt(c, 16)))
  .join("");

console.log(`\n✔ Generated ${KEY_PATH}\n`);
console.log(`Extension ID: ${extensionId}\n`);
console.log("manifest.key (SPKI public, base64):");
console.log(spkiB64);
console.log(
  "\nTo register the key with GitHub Actions (requires gh CLI logged in):\n"
);
console.log(`  gh secret set WXT_CHROME_KEY < ${KEY_PATH}\n`);
