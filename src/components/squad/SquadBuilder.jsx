'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Download, RotateCcw, Save, Shield, Sparkles } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { PLAYERS, getPlayerById } from '@/data/players';
import { FORMATIONS_CONFIG } from '@/lib/formations';
import { calculateSquadRatings, isPositionCompatible } from '@/utils/squadRating';
import { apiRequest } from '@/lib/api/apiClient';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { useSquadsQuery } from '@/lib/api/hooks';
import useAuth from '@/hooks/useAuth';
import FormationSelector from '@/components/squad/FormationSelector';
import SquadPlayerSlot from '@/components/squad/SquadPlayerSlot';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function SquadBuilder() {
  const { authenticated } = useAuth();
  const activeSquadId = useGameStore((s) => s.activeSquadId);
  const loadSquadSnapshot = useGameStore((s) => s.loadSquadSnapshot);
  const squadName = useGameStore((s) => s.squadName);
  const setSquadName = useGameStore((s) => s.setSquadName);
  const formation = useGameStore((s) => s.formation);
  const squadSlots = useGameStore((s) => s.squadSlots);
  const substitutes = useGameStore((s) => s.substitutes);
  const captainPlayerId = useGameStore((s) => s.captainPlayerId);
  const setCaptainPlayerId = useGameStore((s) => s.setCaptainPlayerId);
  const tactics = useGameStore((s) => s.tactics);
  const setTactics = useGameStore((s) => s.setTactics);
  const assignPlayerToSlot = useGameStore((s) => s.assignPlayerToSlot);
  const toggleSubstitute = useGameStore((s) => s.toggleSubstitute);
  const resetSquad = useGameStore((s) => s.resetSquad);

  const { data: savedSquads = [], refetch: refetchSquads } = useSquadsQuery({
    enabled: authenticated,
  });

  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const playerMap = useMemo(() => new Map(PLAYERS.map((p) => [p.id, p])), []);
  const ratings = useMemo(
    () => calculateSquadRatings(squadSlots, playerMap),
    [squadSlots, playerMap]
  );

  const formationMeta = FORMATIONS_CONFIG[formation] || FORMATIONS_CONFIG['4-3-3'];
  const assignedStarterIds = new Set(squadSlots.map((s) => s.playerId).filter(Boolean));
  const eligibleCaptains = squadSlots
    .map((s) => (s.playerId ? getPlayerById(s.playerId) : null))
    .filter(Boolean);

  async function handleSaveToAccount(asNew = false) {
    setStatusMsg('');
    setErrorMsg('');
    if (!authenticated) {
      setErrorMsg('Sign in to save this squad directly to your RIVALRY 90 account.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: squadName.trim() || 'Rivalry XI',
        formation,
        slots: squadSlots,
        substitutes,
        captainPlayerId:
          captainPlayerId && assignedStarterIds.has(captainPlayerId) ? captainPlayerId : null,
        tactics,
      };

      const isUpdating = Boolean(activeSquadId && !asNew);
      const res = await apiRequest(
        isUpdating ? API_ENDPOINTS.SQUADS.DETAIL(activeSquadId) : API_ENDPOINTS.SQUADS.LIST,
        {
          method: isUpdating ? 'PATCH' : 'POST',
          body: payload,
        }
      );
      if (res?.data?.squad) {
        loadSquadSnapshot(res.data.squad);
      }
      await refetchSquads();
      setStatusMsg(
        isUpdating
          ? 'Saved squad updated on server.'
          : 'Squad saved to your account! View it anytime in My Squads.'
      );
    } catch (err) {
      setErrorMsg(err.message || 'Unable to save squad.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAnalyzeSquad() {
    setErrorMsg('');
    if (!authenticated) {
      setErrorMsg('Sign in to run AI Tactical Analysis on your squad.');
      return;
    }
    setAiLoading(true);
    try {
      const res = await apiRequest(API_ENDPOINTS.EXTERNAL.AI_SQUAD_ANALYSIS, {
        method: 'POST',
        body: activeSquadId
          ? { squadId: activeSquadId }
          : {
              name: squadName,
              formation,
              slots: squadSlots,
              captainPlayerId,
              tactics,
            },
      });
      setAiAnalysis(res?.data?.analysis || null);
    } catch (err) {
      setErrorMsg(err.message || 'AI analysis could not be completed.');
    } finally {
      setAiLoading(false);
    }
  }

  function handleExportJson() {
    const payload = {
      name: squadName,
      formation,
      tactics,
      captainPlayerId,
      ratings,
      slots: squadSlots,
      substitutes,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(squadName || 'rivalry90-squad').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6 rounded-2xl border border-[#29342d] bg-[#151d18] p-5 md:p-8">
      <div className="flex flex-col gap-4 border-b border-[#29342d] pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="lime">{formation}</Badge>
            <Badge tone="orange">{ratings.filledCount}/11 Assigned</Badge>
            <Badge tone="neutral">{substitutes.length}/7 Subs</Badge>
          </div>
          <h2 className="font-display text-2xl font-extrabold uppercase text-[#f5f7f2]">
            Interactive Lineup & Pitch Tactics
          </h2>
          <p className="text-xs text-[#9ba69d]">
            Build your starting XI across 10 tactical formations, assign a captain, and save or
            export your tactical sheet.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="rounded-lg border border-[#29342d] bg-[#080b09] px-3.5 py-2 text-right">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#6e7a71]">
              Squad OVR
            </p>
            <p className="font-mono text-xl font-bold text-[#c6ff3d]">
              {ratings.overallRating ?? '--'}
            </p>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={handleExportJson}>
            <Download className="h-3.5 w-3.5" aria-hidden="true" /> Export JSON
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAnalyzeSquad}
            disabled={aiLoading}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#c6ff3d]" aria-hidden="true" />
            {aiLoading ? 'Analyzing...' : 'AI Analyst'}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => handleSaveToAccount(false)}
            disabled={saving}
          >
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
            {saving ? 'Saving...' : activeSquadId ? 'Update Squad' : 'Save Squad'}
          </Button>
          {authenticated && savedSquads?.length > 0 && (
            <select
              aria-label="Load saved squad"
              value={activeSquadId || ''}
              onChange={(e) => {
                const chosen = savedSquads.find((s) => s.id === e.target.value);
                if (chosen) loadSquadSnapshot(chosen);
              }}
              className="rounded-md border border-[#29342d] bg-[#080b09] px-2.5 py-1.5 font-mono text-xs text-[#f5f7f2]"
            >
              <option value="">Load Saved ({savedSquads.length})</option>
              {savedSquads.map((sq) => (
                <option key={sq.id} value={sq.id}>
                  {sq.name} ({sq.formation})
                </option>
              ))}
            </select>
          )}
          <Button type="button" variant="secondary" size="sm" onClick={resetSquad}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reset
          </Button>
        </div>
      </div>

      {statusMsg && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#c6ff3d]/40 bg-[#c6ff3d]/10 px-4 py-3 text-xs text-[#f5f7f2]">
          <span>{statusMsg}</span>
          <Link href="/my-squad" className="font-semibold text-[#c6ff3d] underline">
            Open My Squads
          </Link>
        </div>
      )}
      {errorMsg && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
          <span>{errorMsg}</span>
          {!authenticated && (
            <Link href="/login?next=/squad" className="font-semibold text-[#c6ff3d] underline">
              Sign In
            </Link>
          )}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-4">
        <div className="md:col-span-2">
          <label htmlFor="sq-name" className="block font-mono text-[10px] uppercase text-[#9ba69d]">
            Squad Title
          </label>
          <input
            id="sq-name"
            type="text"
            value={squadName}
            onChange={(e) => setSquadName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-sm text-[#f5f7f2]"
          />
        </div>
        <div>
          <label htmlFor="sq-cap" className="block font-mono text-[10px] uppercase text-[#9ba69d]">
            Captain
          </label>
          <select
            id="sq-cap"
            value={captainPlayerId || ''}
            onChange={(e) => setCaptainPlayerId(e.target.value || null)}
            className="mt-1 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
          >
            <option value="">No Captain Selected</option>
            {eligibleCaptains.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.position})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sq-ment" className="block font-mono text-[10px] uppercase text-[#9ba69d]">
            Mentality
          </label>
          <select
            id="sq-ment"
            value={tactics.mentality}
            onChange={(e) => setTactics({ mentality: e.target.value })}
            className="mt-1 w-full rounded-lg border border-[#29342d] bg-[#080b09] px-3 py-2 text-xs text-[#f5f7f2]"
          >
            <option value="Defensive">Defensive</option>
            <option value="Balanced">Balanced</option>
            <option value="Attacking">Attacking</option>
          </select>
        </div>
      </div>

      <FormationSelector />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Interactive Tactical Pitch */}
        <div className="lg:col-span-5">
          <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-[#29342d] bg-gradient-to-b from-[#0f2419] via-[#0c1d14] to-[#0f2419]">
            <div className="pointer-events-none absolute inset-4 rounded-lg border border-white/15" />
            <div className="pointer-events-none absolute left-4 right-4 top-1/2 border-t border-white/15" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />

            {formationMeta.slots.map((tpl, idx) => {
              const assignedId = squadSlots[idx]?.playerId;
              const player = assignedId ? getPlayerById(assignedId) : null;
              const compatible = isPositionCompatible(tpl.role, player);
              const isCaptain = player && captainPlayerId === player.id;
              return (
                <div
                  key={`${tpl.role}-${idx}`}
                  style={{ left: `${tpl.x}%`, top: `${tpl.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                >
                  <div
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border text-[10px] font-bold shadow-lg ${
                      player
                        ? compatible
                          ? 'border-[#c6ff3d] bg-[#c6ff3d] text-[#080b09]'
                          : 'border-amber-400 bg-amber-400 text-[#080b09]'
                        : 'border-white/30 bg-[#080b09]/85 text-[#9ba69d]'
                    }`}
                  >
                    {player ? player.ovr : tpl.role}
                  </div>
                  <p className="mt-1 max-w-[78px] truncate rounded bg-[#080b09]/80 px-1.5 py-0.5 font-mono text-[9px] text-[#f5f7f2]">
                    {isCaptain ? `© ${player.name}` : player ? player.name : tpl.role}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2 text-center font-mono text-xs">
            <div className="rounded-lg border border-[#29342d] bg-[#080b09] p-2">
              <p className="text-[10px] text-[#9ba69d]">ATK</p>
              <p className="font-bold text-[#f5f7f2]">{ratings.attackRating ?? '--'}</p>
            </div>
            <div className="rounded-lg border border-[#29342d] bg-[#080b09] p-2">
              <p className="text-[10px] text-[#9ba69d]">MID</p>
              <p className="font-bold text-[#f5f7f2]">{ratings.midfieldRating ?? '--'}</p>
            </div>
            <div className="rounded-lg border border-[#29342d] bg-[#080b09] p-2">
              <p className="text-[10px] text-[#9ba69d]">DEF</p>
              <p className="font-bold text-[#f5f7f2]">{ratings.defenceRating ?? '--'}</p>
            </div>
            <div className="rounded-lg border border-[#29342d] bg-[#080b09] p-2">
              <p className="text-[10px] text-[#9ba69d]">CHEM</p>
              <p className="font-bold text-[#c6ff3d]">{ratings.compatibilityPercent}%</p>
            </div>
          </div>
        </div>

        {/* Starting Slots + Bench */}
        <div className="space-y-4 lg:col-span-7">
          <div className="r90-pitch-grid grid gap-3 rounded-xl border border-[#29342d] bg-[#0e1f18]/45 p-4 sm:grid-cols-2">
            {squadSlots.map((slot) => (
              <SquadPlayerSlot key={slot.slotIndex} slot={slot} onAssign={assignPlayerToSlot} />
            ))}
          </div>

          <div className="rounded-xl border border-[#29342d] bg-[#080b09] p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="flex items-center gap-1.5 font-mono text-xs uppercase text-[#c6ff3d]">
                <Shield className="h-3.5 w-3.5" /> Substitutes Bench ({substitutes.length}/7)
              </p>
              <select
                aria-label="Add substitute player"
                value=""
                onChange={(e) => toggleSubstitute(e.target.value)}
                disabled={substitutes.length >= 7}
                className="rounded border border-[#29342d] bg-[#151d18] px-2.5 py-1 text-xs text-[#f5f7f2] disabled:opacity-40"
              >
                <option value="">+ Add Substitute...</option>
                {PLAYERS.filter(
                  (p) => !assignedStarterIds.has(p.id) && !substitutes.includes(p.id)
                ).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.position} · {p.ovr})
                  </option>
                ))}
              </select>
            </div>
            {substitutes.length === 0 ? (
              <p className="text-xs text-[#6e7a71]">No substitutes added yet (max 7).</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {substitutes.map((subId) => {
                  const p = getPlayerById(subId);
                  if (!p) return null;
                  return (
                    <button
                      key={subId}
                      type="button"
                      onClick={() => toggleSubstitute(subId)}
                      className="rounded-md border border-[#29342d] bg-[#151d18] px-2.5 py-1 text-xs text-[#f5f7f2] hover:border-red-400"
                    >
                      {p.name} ({p.position}) ×
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {aiAnalysis && (
        <div className="rounded-xl border border-[#c6ff3d]/35 bg-[#080b09] p-5 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#29342d] pb-3">
            <span className="font-mono uppercase text-[#c6ff3d]">
              AI Tactical Analysis ({aiAnalysis.provider}) • Advisory Only
            </span>
            <button
              type="button"
              onClick={() => setAiAnalysis(null)}
              className="text-[#9ba69d] hover:text-[#f5f7f2]"
            >
              Dismiss
            </button>
          </div>
          <p className="mt-3 text-[#f5f7f2]">{aiAnalysis.overallSummary}</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div>
              <p className="font-mono text-[10px] uppercase text-[#c6ff3d]">Strengths</p>
              <ul className="mt-1 list-disc pl-4 text-[#9ba69d]">
                {aiAnalysis.strengths?.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase text-amber-400">Weaknesses</p>
              <ul className="mt-1 list-disc pl-4 text-[#9ba69d]">
                {aiAnalysis.weaknesses?.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase text-[#f5f7f2]">Suggestions</p>
              <ul className="mt-1 list-disc pl-4 text-[#9ba69d]">
                {aiAnalysis.suggestions?.map((sg, idx) => (
                  <li key={idx}>{sg}</li>
                ))}
              </ul>
            </div>
          </div>
          {aiAnalysis.limitations?.length > 0 && (
            <p className="mt-3 text-[11px] text-[#6e7a71]">{aiAnalysis.limitations[0]}</p>
          )}
        </div>
      )}
    </div>
  );
}
