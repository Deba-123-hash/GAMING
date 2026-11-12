import { FORMATIONS_CONFIG } from '@/lib/formations';
import { getDevStore } from '@/server/database/devMemoryStore';

/**
 * Non-destructive database integrity auditor.
 * Inspects domain invariants across the active store/repository without deleting records.
 */
export function runDatabaseIntegrityAudit(targetStore = null) {
  const store = targetStore || getDevStore();
  const anomalies = [];

  const teamIds = new Set(store.teams.map((t) => t.id));
  const playerMap = new Map(store.players.map((p) => [p.id, p]));
  const userIds = new Set(store.users.map((u) => u.id));

  // 1. Usernames & Profile Ownership
  const seenUsernames = new Set();
  for (const user of store.users) {
    const key = String(user.username || '').toLowerCase();
    if (!key) {
      anomalies.push({ domain: 'users', id: user.id, issue: 'Missing username' });
    } else if (seenUsernames.has(key)) {
      anomalies.push({ domain: 'users', id: user.id, issue: `Duplicate username: ${key}` });
    }
    seenUsernames.add(key);

    if (!['active', 'suspended', 'banned'].includes(user.status)) {
      anomalies.push({
        domain: 'users',
        id: user.id,
        issue: `Invalid user status: ${user.status}`,
      });
    }
  }

  for (const profile of store.profiles) {
    if (!userIds.has(profile.userId)) {
      anomalies.push({ domain: 'profiles', id: profile.id, issue: 'Orphan profile without user' });
    }
  }

  // 2. Players & Team Shirt Numbers
  const teamShirtPairs = new Set();
  const playerSlugs = new Set();
  for (const player of store.players) {
    if (playerSlugs.has(player.slug)) {
      anomalies.push({
        domain: 'players',
        id: player.id,
        issue: `Duplicate player slug: ${player.slug}`,
      });
    }
    playerSlugs.add(player.slug);

    if (!teamIds.has(player.teamId)) {
      anomalies.push({
        domain: 'players',
        id: player.id,
        issue: `Orphan teamId: ${player.teamId}`,
      });
    }
    if (player.ovr < 1 || player.ovr > 99) {
      anomalies.push({
        domain: 'players',
        id: player.id,
        issue: `OVR out of bounds: ${player.ovr}`,
      });
    }
    const shirtKey = `${player.teamId}:${player.number}`;
    if (teamShirtPairs.has(shirtKey)) {
      anomalies.push({
        domain: 'players',
        id: player.id,
        issue: `Duplicate shirt #${player.number} in team ${player.teamId}`,
      });
    }
    teamShirtPairs.add(shirtKey);
  }

  // 3. Squads Invariants (<= 11 starters, <= 7 subs, no duplicates, valid formation)
  for (const squad of store.squads) {
    if (!userIds.has(squad.userId)) {
      anomalies.push({ domain: 'squads', id: squad.id, issue: 'Orphan squad without user owner' });
    }
    if (!FORMATIONS_CONFIG[squad.formation]) {
      anomalies.push({
        domain: 'squads',
        id: squad.id,
        issue: `Unsupported formation: ${squad.formation}`,
      });
    }
    if (!Array.isArray(squad.slots) || squad.slots.length > 11) {
      anomalies.push({ domain: 'squads', id: squad.id, issue: 'Squad exceeds 11 starting slots' });
    }
    if (Array.isArray(squad.substitutes) && squad.substitutes.length > 7) {
      anomalies.push({ domain: 'squads', id: squad.id, issue: 'Squad exceeds 7 substitutes' });
    }

    const assigned = new Set();
    for (const slot of squad.slots || []) {
      if (!slot.playerId) continue;
      if (!playerMap.has(slot.playerId)) {
        anomalies.push({
          domain: 'squads',
          id: squad.id,
          issue: `Unknown starter player: ${slot.playerId}`,
        });
      }
      if (assigned.has(slot.playerId)) {
        anomalies.push({
          domain: 'squads',
          id: squad.id,
          issue: `Duplicate player in squad: ${slot.playerId}`,
        });
      }
      assigned.add(slot.playerId);
    }
    for (const subId of squad.substitutes || []) {
      if (assigned.has(subId)) {
        anomalies.push({
          domain: 'squads',
          id: squad.id,
          issue: `Player listed as both starter and sub: ${subId}`,
        });
      }
      assigned.add(subId);
    }
    if (squad.captainPlayerId && !assigned.has(squad.captainPlayerId)) {
      anomalies.push({
        domain: 'squads',
        id: squad.id,
        issue: 'Captain is not assigned to this squad',
      });
    }
  }

  // 4. Events Date Integrity & Unique Registrations
  const seenEventSlugs = new Set();
  for (const ev of store.events) {
    if (seenEventSlugs.has(ev.slug)) {
      anomalies.push({ domain: 'events', id: ev.id, issue: `Duplicate event slug: ${ev.slug}` });
    }
    seenEventSlugs.add(ev.slug);
    if (new Date(ev.endAt) < new Date(ev.startAt)) {
      anomalies.push({ domain: 'events', id: ev.id, issue: 'Event endAt precedes startAt' });
    }
  }

  // 5. News Unique Slugs
  const seenArticleSlugs = new Set();
  for (const article of store.news) {
    if (seenArticleSlugs.has(article.slug)) {
      anomalies.push({
        domain: 'news',
        id: article.slug,
        issue: `Duplicate article slug: ${article.slug}`,
      });
    }
    seenArticleSlugs.add(article.slug);
  }

  return {
    healthy: anomalies.length === 0,
    checkedAt: new Date().toISOString(),
    counts: {
      users: store.users.length,
      profiles: store.profiles.length,
      teams: store.teams.length,
      players: store.players.length,
      squads: store.squads.length,
      events: store.events.length,
      news: store.news.length,
      media: store.media.length,
      auditLogs: store.auditLogs.length,
    },
    anomalyCount: anomalies.length,
    anomalies,
  };
}
