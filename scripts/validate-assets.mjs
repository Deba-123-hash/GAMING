import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const requiredDirectories = [
  'models/players/goalkeepers',
  'models/players/defenders',
  'models/players/midfielders',
  'models/players/forwards',
  'models/stadium/exterior',
  'models/stadium/interior',
  'models/stadium/stands',
  'models/stadium/tunnel',
  'models/teams',
  'models/crowd',
  'models/football',
  'models/trophies',
  'models/environments',
  'models/props',
  'animations/players/idle',
  'animations/players/walking',
  'animations/players/running',
  'animations/players/dribbling',
  'animations/players/shooting',
  'animations/players/celebration',
  'animations/crowd',
  'animations/stadium',
  'textures/players',
  'textures/kits',
  'textures/grass',
  'textures/stadium',
  'textures/crowd',
  'textures/football',
  'textures/environment',
  'environments/hdri',
  'images/players',
  'images/teams',
  'images/stadium',
  'images/events',
  'images/news',
  'images/branding',
  'videos/hero',
  'videos/trailers',
  'videos/backgrounds',
  'audio/stadium',
  'audio/crowd',
  'audio/football',
  'audio/interface',
  'fonts',
  'icons',
  'placeholders',
];

let missingCount = 0;

for (const relDir of requiredDirectories) {
  const fullPath = path.join(publicDir, relDir);
  if (!fs.existsSync(fullPath)) {
    console.error(`[MISSING] public/${relDir}`);
    missingCount += 1;
  }
}

if (missingCount === 0) {
  console.log(`[OK] All ${requiredDirectories.length} public asset directories verified.`);
} else {
  console.error(`[FAIL] ${missingCount} directories missing.`);
  process.exit(1);
}
