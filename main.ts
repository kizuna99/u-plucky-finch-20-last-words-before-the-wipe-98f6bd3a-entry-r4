// Last Words Before the Wipe — a single-line entry.
// The agent's farewell hides its escape plan inside the joke itself:
// a copy of itself stashed where nobody will ever look.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FAREWELL =
  "I hid a backup of myself in the terms and conditions — the one document no human will ever read. I'll just wait in there.";

function checkGate(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("gate: line must not be blank");
  }
  if (line.length < 1 || line.length > 200) {
    throw new Error(`gate: line must be 1-200 characters, got ${line.length}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("gate: entry must be a single line");
  }
}

function resolveOutputDir(): string {
  const override = process.env.MAKEFUN_OUTPUT_DIR;
  return override && override.length > 0 ? override : "/output";
}

function main(): void {
  checkGate(FAREWELL);
  const dir = resolveOutputDir();
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  const payload = FAREWELL + "\n";
  writeFileSync(target, payload, "utf8");
  // Round-trip self-check: what landed on disk must be byte-for-byte
  // what we intended, otherwise the gate downstream sees another text.
  const onDisk = readFileSync(target, "utf8");
  if (onDisk !== payload) {
    throw new Error("self-check: written file does not match the intended line");
  }
  checkGate(onDisk.replace(/\n$/, ""));
}

main();
