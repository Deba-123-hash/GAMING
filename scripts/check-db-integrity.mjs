import { PLAYERS } from '../src/data/players.js';
import { TEAMS } from '../src/data/teams.js';
import { EVENTS } from '../src/data/events.js';
import { NEWS_ARTICLES } from '../src/data/news.js';
import { FORMATIONS_CONFIG } from '../src/lib/formations.js';

function main() {
  const anomalies = [];
  const teamIds = new Set(TEAMS.map((t) => t.id));
  const seenShirt = new Set();

  for (const player of PLAYERS) {
    if (!teamIds.has(player.teamId)) {
      anomalies.push(`Orphan player teamId on ${player.id}`);
    }
    if (player.ovr < 1 || player.ovr > 99) {
      anomalies.push(`Invalid OVR ${player.ovr} on ${player.id}`);
    }
    const key = `${player.teamId}:${player.number}`;
    if (seenShirt.has(key)) {
      anomalies.push(`Duplicate shirt number ${key}`);
    }
    seenShirt.add(key);
  }

  for (const ev of EVENTS) {
    if (new Date(ev.endAt) < new Date(ev.startAt)) {
      anomalies.push(`Invalid event window on ${ev.slug}`);
    }
  }

  const articleSlugs = new Set();
  for (const article of NEWS_ARTICLES) {
    if (articleSlugs.has(article.slug)) {
      anomalies.push(`Duplicate article slug ${article.slug}`);
    }
    articleSlugs.add(article.slug);
  }

  for (const [code, formation] of Object.entries(FORMATIONS_CONFIG)) {
    if (formation.slots.length !== 11) {
      anomalies.push(`Formation ${code} does not have 11 positions`);
    }
  }

  if (anomalies.length > 0) {
    console.error('[ERROR] Database integrity anomalies found:', anomalies);
    process.exit(1);
  }

  console.log('[OK] All relational fixture integrity checks passed (0 anomalies).');
}

main();
