export const MAIN_NAV_LINKS = [
  { label: 'Overview', href: '/overview', group: 'DISCOVER' },
  { label: 'Game Modes', href: '/game-modes', group: 'PLAY' },
  { label: 'Players', href: '/players', group: 'FOOTBALL' },
  { label: 'Teams', href: '/teams', group: 'FOOTBALL' },
  { label: 'Stadium', href: '/stadium', group: 'FOOTBALL' },
  { label: 'Squad', href: '/squad', group: 'FOOTBALL' },
  { label: 'Events', href: '/events', group: 'COMPETITIONS' },
  { label: 'News', href: '/news', group: 'DISCOVER' },
  { label: 'Media', href: '/media', group: 'DISCOVER' },
  { label: 'Community', href: '/community', group: 'DISCOVER' },
];

export const MEGA_MENU_GROUPS = [
  {
    id: 'PLAY',
    label: 'Play',
    summary: 'Explore competitive and solo football mode concepts.',
    links: [
      { label: 'All Game Modes', href: '/game-modes', note: '6 core mode concepts' },
      { label: 'Quick Match', href: '/game-modes#quick-match', note: 'Instant kickoff preview' },
      { label: 'Career Mode', href: '/game-modes#career-mode', note: 'Club progression concept' },
      {
        label: 'Tournament & Penalty',
        href: '/game-modes#tournament',
        note: 'Knockout & shootout',
      },
    ],
  },
  {
    id: 'FOOTBALL',
    label: 'Football',
    summary: 'Inspect original athletes, fictional clubs, stadiums, and tactics.',
    links: [
      { label: 'Players Directory', href: '/players', note: '3D athlete inspection' },
      { label: 'Clubs & Teams', href: '/teams', note: 'Founding fictional clubs' },
      { label: 'Stadium Experience', href: '/stadium', note: '3D floodlit bowl' },
      { label: 'Squad Builder XI', href: '/squad', note: 'Interactive lineup lab' },
    ],
  },
  {
    id: 'COMPETITIONS',
    label: 'Competitions',
    summary: 'Seasonal cups, championship concepts, and esports showcases.',
    links: [
      { label: 'Events & Cups', href: '/events', note: 'Rivalry Cup & Showdowns' },
      { label: 'Esports Showcase', href: '/community#esports', note: 'Competitive vision' },
      { label: 'Cinematic Stage', href: '/stadium#cinematics', note: 'Matchday & Trophy reels' },
    ],
  },
  {
    id: 'DISCOVER',
    label: 'Discover',
    summary: 'Editorial dispatches, media gallery, community, and studio tools.',
    links: [
      { label: 'Overview', href: '/overview', note: 'Universe vision' },
      { label: 'News Dispatches', href: '/news', note: 'Studio & dev notes' },
      { label: 'Media Gallery', href: '/media', note: 'Concept visuals & lightbox' },
      { label: 'Community & Support', href: '/community', note: 'Hubs & FAQ' },
      { label: '3D Dev Hub', href: '/resources/3d', note: 'Internal 3D pipeline' },
    ],
  },
];

export const FOOTER_NAV_COLUMNS = [
  {
    title: 'Game',
    links: [
      { label: 'Overview', href: '/overview' },
      { label: 'Game Modes', href: '/game-modes' },
      { label: 'Players', href: '/players' },
      { label: 'Teams', href: '/teams' },
      { label: 'Stadiums', href: '/stadium' },
      { label: 'Squad', href: '/squad' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Events', href: '/events' },
      { label: 'News', href: '/news' },
      { label: 'Media', href: '/media' },
      { label: 'Community', href: '/community' },
      { label: 'Design System', href: '/design-system' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Support & FAQ', href: '/support' },
      { label: 'Contact Demo', href: '/support#contact-form' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: '3D Dev Hub', href: '/resources/3d' },
    ],
  },
];
