export function computeEventStatus(event, now = new Date()) {
  if (event.manualStatus === 'Cancelled' || event.manualStatus === 'Postponed') {
    return event.manualStatus;
  }
  const start = new Date(event.startAt);
  const end = new Date(event.endAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'Upcoming';
  }
  if (now < start) return 'Upcoming';
  if (now >= start && now <= end) return 'Live';
  return 'Completed';
}

export const EVENTS = [
  {
    id: 'rivalry-cup',
    slug: 'rivalry-cup',
    title: 'RIVALRY CUP',
    category: 'Tournament Announcements',
    format: 'Knockout Cup Concept',
    startAt: '2026-12-10T18:00:00Z',
    endAt: '2026-12-14T22:00:00Z',
    registrationDeadline: '2026-12-08T23:59:00Z',
    location: 'Apex Arena (Online Showcase)',
    isOnline: true,
    rules: '11-player fictional squad concept with standard 4-3-3/4-2-3-1 tactical presets.',
    rewards: 'Digital Championship Trophy Badge (Concept)',
    eligibility: 'Registered RIVALRY 90 Community Members',
    isFeatured: true,
    publicationStatus: 'published',
    description:
      'Flagship cross-club tournament concept uniting the six founding fictional clubs beneath Apex Arena floodlights.',
  },
  {
    id: 'champions-week',
    slug: 'champions-week',
    title: 'CHAMPIONS WEEK',
    category: 'Seasonal Events',
    format: 'Club Showcase Series',
    startAt: '2026-12-20T16:00:00Z',
    endAt: '2026-12-27T22:00:00Z',
    registrationDeadline: '2026-12-19T23:59:00Z',
    location: 'Global Online',
    isOnline: true,
    rules: 'Showcase tactical lineups featuring at least 3 Rising Star athletes.',
    rewards: 'Seasonal Spotlight Emblem (Concept)',
    eligibility: 'Open Preview',
    isFeatured: false,
    publicationStatus: 'published',
    description:
      'Week-long spotlight celebrating tactical lineups, featured fictional athletes, and stadium atmosphere.',
  },
  {
    id: 'weekend-showdown',
    slug: 'weekend-showdown',
    title: 'WEEKEND SHOWDOWN',
    category: 'Online Gaming Events',
    format: 'Short-Form Bracket',
    startAt: '2027-01-09T14:00:00Z',
    endAt: '2027-01-10T21:00:00Z',
    registrationDeadline: '2027-01-08T23:59:00Z',
    location: 'Global Online',
    isOnline: true,
    rules: 'Single-elimination 5v5 Neon Cage concept rules.',
    rewards: 'Weekend Winner Title (Concept)',
    eligibility: 'All Accounts',
    isFeatured: false,
    publicationStatus: 'published',
    description: 'Fast-turnaround competitive bracket concept built for high-tempo club rivalries.',
  },
  {
    id: 'road-to-glory',
    slug: 'road-to-glory',
    title: 'ROAD TO GLORY',
    category: 'Community Events',
    format: 'Qualifier Path',
    startAt: '2027-01-20T12:00:00Z',
    endAt: '2027-01-25T22:00:00Z',
    registrationDeadline: '2027-01-19T23:59:00Z',
    location: 'Online Qualifier',
    isOnline: true,
    rules: 'Submit a valid 11-player + 7-sub Squad Builder XI.',
    rewards: 'Community Hall Entry (Concept)',
    eligibility: 'Authenticated Profiles',
    isFeatured: false,
    publicationStatus: 'published',
    description:
      'Progressive community challenge concept leading into the seasonal Trophy Presentation showcase.',
  },
  {
    id: 'foundry-derby-night',
    slug: 'foundry-derby-night',
    title: 'FOUNDRY DERBY NIGHT',
    category: 'Special Challenges',
    format: 'Club Derby Showcase',
    startAt: '2026-10-12T18:00:00Z',
    endAt: '2026-10-14T22:00:00Z',
    registrationDeadline: '2026-10-10T23:59:00Z',
    location: 'The Foundry Ground (Concept)',
    isOnline: true,
    rules: 'Ironclad Rovers vs Apex United tactical formation challenge.',
    rewards: 'Archive Spotlight',
    eligibility: 'Completed Showcase',
    isFeatured: false,
    publicationStatus: 'published',
    description:
      'Completed autumn showcase spotlighting compact defensive setups vs high-press clubs.',
  },
  {
    id: 'dev-3d-pipeline-showcase',
    slug: 'dev-3d-pipeline-showcase',
    title: 'STUDIO 3D PIPELINE LIVE',
    category: 'Developer Events',
    format: 'Tech Art Walkthrough',
    startAt: '2026-11-10T00:00:00Z',
    endAt: '2026-11-18T23:59:00Z',
    registrationDeadline: '2026-11-17T23:59:00Z',
    location: 'RIVALRY 90 /resources/3d Hub',
    isOnline: true,
    rules: 'Open walkthrough of Draco/KTX2 optimization and R3F v9 scenes.',
    rewards: 'Developer Hub Access',
    eligibility: 'Public Showcase',
    isFeatured: false,
    publicationStatus: 'published',
    description:
      'Ongoing technical showcase highlighting our Blender-to-Three.js stadium workflow.',
  },
];
