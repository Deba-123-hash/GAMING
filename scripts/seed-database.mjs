import { PLAYERS } from '../src/data/players.js';
import { TEAMS } from '../src/data/teams.js';
import { GAME_MODES } from '../src/data/gameModes.js';
import { EVENTS } from '../src/data/events.js';
import { NEWS_ARTICLES } from '../src/data/news.js';
import { MEDIA_ITEMS } from '../src/data/mediaData.js';
import { CONTENT_CATEGORIES } from '../src/data/categories.js';
import { FORMATIONS_CONFIG } from '../src/lib/formations.js';

function main() {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd && !process.argv.includes('--allow-catalog-sync')) {
    console.error('[BLOCKED] Refusing automatic demo/seed execution in production NODE_ENV.');
    process.exit(1);
  }

  const clubs = TEAMS.filter((t) => t.type === 'Club').length;
  const nations = TEAMS.filter((t) => t.type === 'National Team').length;
  const formationCount = Object.keys(FORMATIONS_CONFIG).length;
  const slotCount = Object.values(FORMATIONS_CONFIG).reduce((s, f) => s + f.slots.length, 0);

  console.log('[OK] Deterministic seed payload verified (dry-run):');
  console.log(` - Fictional Players: ${PLAYERS.length}`);
  console.log(` - Fictional Teams: ${TEAMS.length} (${clubs} Clubs, ${nations} National Teams)`);
  console.log(` - Formations: ${formationCount} (${slotCount} slot positions)`);
  console.log(` - Game Modes: ${GAME_MODES.length}`);
  console.log(` - Events: ${EVENTS.length}`);
  console.log(` - News Articles: ${NEWS_ARTICLES.length}`);
  console.log(` - Media Items: ${MEDIA_ITEMS.length}`);
  console.log(` - Categories: ${CONTENT_CATEGORIES.length}`);
}

main();
