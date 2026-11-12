/**
 * RIVALRY 90 — GLB Asset Optimization Helper
 *
 * Usage:
 *   node scripts/optimize-models.mjs <input.glb> <output.glb>
 *
 * Runs @gltf-transform/cli optimization (Draco geometry + WebP textures)
 * followed by gltf-validator verification.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  console.log('Usage: node scripts/optimize-models.mjs <input.glb> <output.glb>');
  process.exit(0);
}

const resolvedIn = path.resolve(inputPath);
const resolvedOut = path.resolve(outputPath);

if (!fs.existsSync(resolvedIn)) {
  console.error(`Input file not found: ${resolvedIn}`);
  process.exit(1);
}

const npxBin = process.platform === 'win32' ? 'npx.cmd' : 'npx';

console.log(`Optimizing ${resolvedIn} -> ${resolvedOut} ...`);
execFileSync(
  npxBin,
  [
    'gltf-transform',
    'optimize',
    resolvedIn,
    resolvedOut,
    '--compress',
    'draco',
    '--texture-compress',
    'webp',
  ],
  { stdio: 'inherit' }
);

console.log(`Validating ${resolvedOut} ...`);
execFileSync(npxBin, ['gltf-validator', resolvedOut], { stdio: 'inherit' });
console.log('Done.');
