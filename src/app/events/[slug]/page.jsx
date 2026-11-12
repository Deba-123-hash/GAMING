'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, CheckCircle2, MapPin, Shield, Trophy } from 'lucide-react';
import { EVENTS, computeEventStatus } from '@/data/events';
import { apiRequest } from '@/lib/api/apiClient';
import useAuth from '@/hooks/useAuth';
import Badge from '@/components/ui/Badge';

export default function EventDetailPage({ params }) {
  const { slug } = use(params);
  const { authenticated } = useAuth();
  const event = EVENTS.find((ev) => ev.slug === slug || ev.id === slug);

  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold uppercase text-[#f5f7f2]">
          Event Not Found
        </h1>
        <p className="mt-2 text-sm text-[#9ba69d]">
          The requested tournament concept could not be located.
        </p>
        <Link
          href="/events"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#c6ff3d] px-4 py-2 text-xs font-bold uppercase text-[#080b09]"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  const liveStatus = computeEventStatus(event);

  async function handleRegister() {
    setError('');
    setMessage('');
    if (!authenticated) {
      setError('Please sign in first to register for this event.');
      return;
    }
    setRegistering(true);
    try {
      await apiRequest(`/api/events/${event.slug}/register`, { method: 'POST' });
      setRegistered(true);
      setMessage('Your registration slot has been recorded for this event.');
    } catch (err) {
      setError(err.message || 'Unable to register for event.');
    } finally {
      setRegistering(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase text-[#9ba69d] hover:text-[#c6ff3d]"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Events
      </Link>

      <div className="mt-6 rounded-2xl border border-[#29342d] bg-[#101612] p-8 shadow-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={liveStatus === 'Upcoming' || liveStatus === 'Live' ? 'lime' : 'orange'}>
            {liveStatus}
          </Badge>
          <Badge tone="neutral">{event.category}</Badge>
          <Badge tone="neutral">{event.format}</Badge>
        </div>

        <h1 className="mt-4 font-display text-4xl font-extrabold uppercase text-[#f5f7f2]">
          {event.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[#9ba69d]">{event.description}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#29342d] bg-[#151d18] p-4 text-xs">
            <p className="flex items-center gap-1.5 font-mono uppercase text-[#c6ff3d]">
              <Calendar className="h-3.5 w-3.5" /> Schedule Window
            </p>
            <p className="mt-2 text-[#f5f7f2]">Starts: {new Date(event.startAt).toUTCString()}</p>
            <p className="mt-1 text-[#9ba69d]">Ends: {new Date(event.endAt).toUTCString()}</p>
          </div>

          <div className="rounded-xl border border-[#29342d] bg-[#151d18] p-4 text-xs">
            <p className="flex items-center gap-1.5 font-mono uppercase text-[#c6ff3d]">
              <MapPin className="h-3.5 w-3.5" /> Venue & Eligibility
            </p>
            <p className="mt-2 text-[#f5f7f2]">{event.location}</p>
            <p className="mt-1 text-[#9ba69d]">{event.eligibility || 'Registered Members'}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[#29342d] bg-[#080b09] p-5">
            <p className="flex items-center gap-1.5 font-mono text-xs uppercase text-[#c6ff3d]">
              <Shield className="h-3.5 w-3.5" /> Rules & Format
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[#9ba69d]">
              {event.rules || 'Standard RIVALRY 90 competitive format applies.'}
            </p>
          </div>

          <div className="rounded-xl border border-[#29342d] bg-[#080b09] p-5">
            <p className="flex items-center gap-1.5 font-mono text-xs uppercase text-[#c6ff3d]">
              <Trophy className="h-3.5 w-3.5" /> Rewards
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[#9ba69d]">
              {event.rewards || 'Season Leaderboard Prestige Badge'}
            </p>
          </div>
        </div>

        {message && (
          <div className="mt-6 flex items-center gap-2 rounded-lg border border-[#c6ff3d]/40 bg-[#c6ff3d]/10 px-4 py-3 text-xs text-[#f5f7f2]">
            <CheckCircle2 className="h-4 w-4 text-[#c6ff3d]" />
            {message}
          </div>
        )}
        {error && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
            <span>{error}</span>
            {!authenticated && (
              <Link
                href={`/login?next=/events/${event.slug}`}
                className="font-semibold text-[#c6ff3d] underline"
              >
                Sign In
              </Link>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={registering || registered}
            onClick={handleRegister}
            className="rounded-lg bg-[#c6ff3d] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#080b09] disabled:opacity-50"
          >
            {registered ? 'Registered' : registering ? 'Registering...' : 'Register for Event'}
          </button>
          <span className="font-mono text-[11px] text-[#6e7a71]">
            Concept registration tracked in Phase 16 event registry.
          </span>
        </div>
      </div>
    </div>
  );
}
