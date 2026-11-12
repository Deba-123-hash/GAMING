import crypto from 'node:crypto';
import { getDevStore } from '@/server/database/devMemoryStore';
import { fetchWithReliability } from '@/lib/integrations/httpClient';
import {
  getIntegrationState,
  recordIntegrationProbe,
} from '@/lib/integrations/integrationRegistry';
import { calculateSquadRatings } from '@/utils/squadRating';

function sanitizePromptText(text) {
  return String(text || '')
    .replace(/(ignore previous instructions|system prompt|reveal secret)/gi, '[filtered]')
    .trim()
    .slice(0, 1200);
}

function recordAiUsage({ userId = null, modelName, featureName, status, latencyMs = 0 }) {
  const store = getDevStore();
  store.aiUsageRecords.unshift({
    id: crypto.randomUUID(),
    userId,
    providerId: 'gemini-ai',
    modelName,
    featureName,
    status,
    latencyMs,
    createdAt: new Date().toISOString(),
  });
  if (store.aiUsageRecords.length > 200) store.aiUsageRecords.length = 200;
}

function getAiConfig() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  return { apiKey, model, configured: Boolean(apiKey) };
}

async function callGeminiText({ prompt, userId, featureName }) {
  const state = getIntegrationState('gemini-ai');
  const { apiKey, model, configured } = getAiConfig();
  if (!state.enabled || !configured) {
    return null;
  }

  const start = Date.now();
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent`;
    const { data } = await fetchWithReliability({
      providerId: 'gemini-ai',
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: sanitizePromptText(prompt) }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 700,
        },
      }),
      timeoutMs: 9000,
    });

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) {
      throw new Error('Gemini returned empty candidate text.');
    }

    recordIntegrationProbe('gemini-ai', { ok: true });
    recordAiUsage({
      userId,
      modelName: model,
      featureName,
      status: 'success',
      latencyMs: Date.now() - start,
    });
    return { text, model };
  } catch (err) {
    recordIntegrationProbe('gemini-ai', { ok: false, error: err.message });
    recordAiUsage({
      userId,
      modelName: model,
      featureName,
      status: 'failed',
      latencyMs: Date.now() - start,
    });
    throw err;
  }
}

export async function analyzeSquadWithAi({ squad, playerMap, userId }) {
  const ratings = calculateSquadRatings(squad.slots, playerMap);
  const filledPlayers = squad.slots
    .filter((s) => s.playerId && playerMap.has(s.playerId))
    .map((s) => {
      const p = playerMap.get(s.playerId);
      return `${s.role}:${p.name}(OVR ${p.ovr},NAT ${p.position})`;
    });

  const prompt = `Analyze this RIVALRY 90 football squad as concise advisory coaching suggestions only. Never invent match guarantees. Formation: ${squad.formation}. Mentality: ${squad.tactics?.mentality || 'Balanced'}. Filled (${ratings.filledCount}/11): ${filledPlayers.join(', ')}. OVR=${ratings.overallRating ?? 0}, ATK=${ratings.attackRating ?? 0}, MID=${ratings.midfieldRating ?? 0}, DEF=${ratings.defenceRating ?? 0}, Compatibility=${ratings.compatibilityPercent}%. Respond briefly with strengths, weaknesses, and formation advice.`;

  const geminiResult = await callGeminiText({
    prompt,
    userId,
    featureName: 'squad-analysis',
  });

  const strengths = [];
  const weaknesses = [];
  const suggestions = [];

  if ((ratings.attackRating || 0) >= 85)
    strengths.push('High offensive rating across forward slots.');
  if ((ratings.midfieldRating || 0) >= 84) strengths.push('Balanced midfield progression core.');
  if (ratings.compatibilityPercent >= 90)
    strengths.push('Strong positional compatibility in formation.');

  if (ratings.filledCount < 11) {
    weaknesses.push(`Lineup incomplete (${ratings.filledCount}/11 starters assigned).`);
    suggestions.push('Fill remaining open starting XI slots before locking captain.');
  }
  if (ratings.compatibilityPercent < 80) {
    weaknesses.push(
      `Positional chemistry is ${ratings.compatibilityPercent}% (out-of-position starters detected).`
    );
    suggestions.push('Match natural positions or switch formation to fit midfielders/wingers.');
  }
  if (!squad.captainPlayerId) {
    suggestions.push('Assign a starting XI captain to complete tactical setup.');
  }

  return {
    aiProviderConnected: Boolean(geminiResult),
    provider: geminiResult ? `gemini (${geminiResult.model})` : 'deterministic-advisory-fallback',
    advisoryOnly: true,
    overallSummary:
      geminiResult?.text ||
      `Advisory review for ${squad.name} (${squad.formation}): ${ratings.filledCount}/11 positions filled with ${ratings.overallRating ?? '--'} average OVR and ${ratings.compatibilityPercent}% positional fit.`,
    strengths: strengths.length ? strengths : ['Baseline squad structure ready for refinement.'],
    weaknesses: weaknesses.length ? weaknesses : ['No critical structural weaknesses detected.'],
    formationAnalysis: `Configured in ${squad.formation} with ${squad.tactics?.mentality || 'Balanced'} mentality.`,
    defensiveAnalysis: `Defensive unit rated ${ratings.defenceRating ?? 'unassigned'} (GK ${ratings.goalkeeperRating ?? '--'}).`,
    attackingAnalysis: `Attacking unit rated ${ratings.attackRating ?? 'unassigned'}.`,
    suggestions: suggestions.length
      ? suggestions
      : ['Compare alternative formations in Squad Builder before saving.'],
    limitations: geminiResult
      ? ['AI suggestions are advisory only and never modify your squad automatically.']
      : [
          'GEMINI_API_KEY is not configured; returning deterministic tactical heuristic rather than live Gemini output.',
        ],
  };
}

export async function analyzePlayerWithAi({ players, userId }) {
  const summaries = players.map(
    (p) =>
      `${p.name} (${p.position}, OVR ${p.ovr}, PAC ${p.stats.pace}, SHO ${p.stats.shooting}, PAS ${p.stats.passing}, DRI ${p.stats.dribbling}, DEF ${p.stats.defending}, PHY ${p.stats.physical})`
  );

  const geminiResult = await callGeminiText({
    prompt: `Provide a concise advisory football attribute breakdown for: ${summaries.join(' vs ')}.`,
    userId,
    featureName: 'player-analysis',
  });

  return {
    aiProviderConnected: Boolean(geminiResult),
    provider: geminiResult ? `gemini (${geminiResult.model})` : 'deterministic-advisory-fallback',
    advisoryOnly: true,
    summary:
      geminiResult?.text ||
      `Attribute snapshot for ${players.map((p) => `${p.name} (${p.position} · ${p.ovr})`).join(' vs ')}. Configure GEMINI_API_KEY for full AI commentary.`,
    players: players.map((p) => ({
      id: p.id,
      name: p.name,
      position: p.position,
      ovr: p.ovr,
      topAttribute: Object.entries(p.stats).sort((a, b) => b[1] - a[1])[0],
    })),
  };
}

export async function askFootballAssistant({ question, userId }) {
  const cleanQuestion = sanitizePromptText(question);
  const geminiResult = await callGeminiText({
    prompt: `Answer this RIVALRY 90 football tactics/game-guide question clearly and concisely: ${cleanQuestion}`,
    userId,
    featureName: 'football-assistant',
  });

  return {
    aiProviderConnected: Boolean(geminiResult),
    provider: geminiResult ? `gemini (${geminiResult.model})` : 'deterministic-advisory-fallback',
    advisoryOnly: true,
    answer:
      geminiResult?.text ||
      `AI Assistant received "${cleanQuestion}". Configure GEMINI_API_KEY in .env.local to enable live Gemini responses; until then, explore /squad formations and /players attribute profiles.`,
  };
}

export async function probeAiConnection() {
  const { configured, model } = getAiConfig();
  if (!configured) {
    return {
      providerId: 'gemini-ai',
      configured: false,
      connected: false,
      message: 'GEMINI_API_KEY is not configured.',
    };
  }
  const res = await callGeminiText({
    prompt: 'Reply with OK.',
    userId: null,
    featureName: 'health-probe',
  });
  return {
    providerId: 'gemini-ai',
    configured: true,
    connected: Boolean(res?.text),
    message: res?.text ? `Connected to Gemini (${model}).` : 'Gemini did not return output.',
  };
}
