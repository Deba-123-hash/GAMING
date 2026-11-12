import { GAME_MODES } from '@/data/gameModes';
import { EVENTS } from '@/data/events';
import { NEWS_ARTICLES } from '@/data/news';
import { STADIUMS } from '@/data/stadiums';

export async function listGameModes() {
  return { items: GAME_MODES, source: 'local-static' };
}

export async function listEvents() {
  return { items: EVENTS, source: 'local-static' };
}

export async function listNews() {
  return { items: NEWS_ARTICLES, source: 'local-static' };
}

export async function listStadiums() {
  return { items: STADIUMS, source: 'local-static' };
}
