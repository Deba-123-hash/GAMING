export const NEWS_ARTICLES = [
  {
    slug: 'introducing-rivalry-90-stadium-engine',
    title: 'Inside the RIVALRY 90 Floodlight Stadium Showcase',
    category: 'Development Updates',
    publishedAt: '2026-11-01',
    author: 'RIVALRY 90 Tech Art Team',
    tags: ['Three.js', 'WebGL', 'Stadium'],
    publicationStatus: 'published',
    isFeatured: true,
    excerpt:
      'How we balance atmospheric night-match WebGL visuals, instanced crowds, and mobile performance budgets.',
    body: [
      'RIVALRY 90 is engineered around progressive 3D storytelling—starting with an aerial stadium reveal before descending through the tunnel onto the pitch.',
      'By combining React Three Fiber, instanced crowd rendering, and strict Draco/KTX2 asset budgets, every showcase scene degrades gracefully on mobile and non-WebGL devices.',
    ],
  },
  {
    slug: 'meet-the-founders-fictional-clubs',
    title: 'Meet the Founding Clubs of Season Zero',
    category: 'Club and Team News',
    publishedAt: '2026-11-03',
    author: 'RIVALRY 90 Narrative Desk',
    tags: ['Clubs', 'Universe'],
    publicationStatus: 'published',
    isFeatured: false,
    excerpt:
      'Explore the tactical philosophies and stadium identities of Apex United, Valkyrie FC, Solstice Athletic, and Ironclad Rovers.',
    body: [
      'Every athlete, crest, and arena in RIVALRY 90 is created from the ground up with original colors and distinct footballing identity.',
      'From Apex United’s relentless press to Solstice Athletic’s midfield triangles, each club anchors upcoming seasonal events and squad-builder challenges.',
    ],
  },
  {
    slug: 'character-animation-pipeline-mixamo-blender',
    title: 'Building Responsive Player Locomotion with AnimationMixer',
    category: 'Behind the Scenes',
    publishedAt: '2026-11-05',
    author: '3D Pipeline Engineering',
    tags: ['Blender', 'Mixamo', 'Animation'],
    publicationStatus: 'published',
    isFeatured: false,
    excerpt:
      'A look at our standardized clip blending across idle, walk, sprint, dribble, strike, and celebration states.',
    body: [
      'Smooth transitions between athletic poses require clean humanoid rigging, consistent root orientation, and deterministic crossfading in Three.js.',
      'Our internal /resources/3d hub centralizes every modeling, rigging, optimization, and license-tracking step for contributors.',
    ],
  },
  {
    slug: 'national-selections-join-rivalry-90',
    title: 'Four Fictional National Teams Join the Roster',
    category: 'Player Universe',
    publishedAt: '2026-11-06',
    author: 'Universe Design Desk',
    tags: ['National Teams', 'Roster'],
    publicationStatus: 'published',
    isFeatured: false,
    excerpt:
      'Norland, Valoria, Eastmere, and Ardent bring distinct international formations to the Teams directory.',
    body: [
      'International football brings sharp tactical contrasts—from Valoria’s 4-2-3-1 possession engine to Eastmere’s high-velocity 3-4-3 counter-attack.',
      'All four national selections are now browsable with full player rosters inside /teams.',
    ],
  },
  {
    slug: 'ten-formations-arrive-in-squad-builder',
    title: 'Ten Tactical Formations Live in Squad Builder XI',
    category: 'Gameplay Features',
    publishedAt: '2026-11-07',
    author: 'Product Systems Team',
    tags: ['Squad Builder', 'Formations'],
    publicationStatus: 'published',
    isFeatured: false,
    excerpt:
      'Switch between 4-3-3, 4-4-2, 4-2-3-1, 3-5-2, 5-3-2, 4-1-4-1, 4-3-2-1, 3-4-3, 4-5-1, and 5-4-1 with position compatibility checks.',
    body: [
      'Our upgraded Squad Builder computes position-aware Attack, Midfield, Defence, and Goalkeeper ratings transparently while preventing duplicate player slots.',
    ],
  },
  {
    slug: 'design-system-and-dark-stadium-palette',
    title: 'Designing the Floodlit Dark Stadium UI System',
    category: 'Behind the Scenes',
    publishedAt: '2026-11-08',
    author: 'RIVALRY 90 Design Systems',
    tags: ['Design System', 'UI/UX'],
    publicationStatus: 'published',
    isFeatured: false,
    excerpt:
      'Why deep charcoal #080B09, electric lime #C6FF3D, and condensed athletic typography define our brand identity.',
    body: [
      'Inspect every standardized button, badge, card, modal, and SVG brand mark live inside our /design-system showcase.',
    ],
  },
  {
    slug: 'cinematic-camera-director-preview',
    title: 'Previewing the Six-Scene Cinematic Camera Director',
    category: 'Game Updates',
    publishedAt: '2026-11-09',
    author: 'Cinematic Engineering',
    tags: ['Cinematics', 'CameraRig'],
    publicationStatus: 'published',
    isFeatured: false,
    excerpt:
      'Switch between Aerial Reveal, Tunnel Walkout, Broadcast Kickoff, and Trophy Presentation presets on /stadium.',
    body: [
      'Built with accessibility first: every cinematic camera sweep includes Play/Pause, Next, Replay, Skip, and automatic reduced-motion fallbacks.',
    ],
  },
  {
    slug: 'position-weighted-player-ratings-explained',
    title: 'How RIVALRY 90 Calculates Position-Weighted OVR',
    category: 'Player Universe',
    publishedAt: '2026-11-10',
    author: 'Football Data Architecture',
    tags: ['Ratings', 'Attributes'],
    publicationStatus: 'published',
    isFeatured: false,
    excerpt:
      'Why strikers, midfielders, defenders, and sweepers weigh attributes differently across our 32 fictional athletes.',
    body: [
      'Instead of naively averaging six numbers, our rating model weights finishing for forwards, passing and dribbling for playmakers, and defending/physicality for stoppers.',
    ],
  },
  {
    slug: 'rivalry-cup-concept-announcement',
    title: 'RIVALRY Cup Concept Opens Event Calendar',
    category: 'Events and Tournaments',
    publishedAt: '2026-11-11',
    author: 'Competitions Desk',
    tags: ['Events', 'Rivalry Cup'],
    publicationStatus: 'published',
    isFeatured: false,
    excerpt:
      'Explore seasonal knockout tournament concepts and registration workflows in the upgraded Events hub.',
    body: [
      'Visit /events to filter seasonal, community, and developer showcase events with server-calculated date statuses.',
    ],
  },
  {
    slug: 'backend-security-and-rbac-foundation',
    title: 'Hardening RIVALRY 90 with RBAC and Audit Logging',
    category: 'Announcements',
    publishedAt: '2026-11-12',
    author: 'Platform Security Team',
    tags: ['Security', 'RBAC', 'API'],
    publicationStatus: 'published',
    isFeatured: false,
    excerpt:
      'Server-side Zod validation, permission registries, and immutable audit logs establish our enterprise backend foundation.',
    body: [
      'From scrypt password hashing and HttpOnly session cookies to role-based /admin enforcement, every mutation is validated strictly on the server.',
    ],
  },
];

export function getNewsBySlug(slug) {
  return NEWS_ARTICLES.find((article) => article.slug === slug) || null;
}
