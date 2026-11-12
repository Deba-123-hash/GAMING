import { describe, expect, it } from 'vitest';
import { PLAYERS, getPlayerById } from '@/data/players';
import { TEAMS, getTeamById } from '@/data/teams';
import { GAME_MODES } from '@/data/gameModes';
import { EVENTS } from '@/data/events';
import { NEWS_ARTICLES } from '@/data/news';
import { THREE_D_RESOURCES, validateThreeDResources } from '@/data/threeDResources';
import { ASSET_REGISTRY } from '@/data/assetRegistry';

describe('Structured data modules', () => {
  it('provides 32 fictional players and lookup helper', () => {
    expect(PLAYERS.length).toBe(32);
    expect(getPlayerById('kai-vance')?.name).toBe('Kai Vance');
    expect(getPlayerById('nonexistent')).toBeNull();
  });

  it('provides 10 fictional teams (clubs & national teams), 8 game modes, events, and news', () => {
    expect(TEAMS.length).toBe(10);
    expect(getTeamById('apex-united')?.shortCode).toBe('APX');
    expect(GAME_MODES.length).toBe(8);
    expect(EVENTS.length).toBe(6);
    expect(NEWS_ARTICLES.length).toBe(10);
  });

  it('validates all 3D resource URLs cleanly', () => {
    const valid = validateThreeDResources(THREE_D_RESOURCES);
    expect(valid.length).toBe(THREE_D_RESOURCES.length);
  });

  it('keeps asset registry honest about procedural placeholders', () => {
    expect(ASSET_REGISTRY.every((asset) => asset.isPlaceholder === true)).toBe(true);
  });
});
