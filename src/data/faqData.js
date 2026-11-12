export const FAQ_ITEMS = [
  {
    id: 'faq-webgl',
    category: '3D & Performance',
    question: 'Why does a 3D stadium or player scene show a fallback panel on some devices?',
    answer:
      'When WebGL2/WebGL1 is unavailable, disabled, or encounters context loss, RIVALRY 90 automatically switches to a safe 2D fallback so all navigation, squad building, and content remain usable.',
  },
  {
    id: 'faq-audio',
    category: 'Audio & Accessibility',
    question: 'Why is stadium audio silent when I first open the website?',
    answer:
      'Audio via Howler.js is strictly muted by default to respect browser autoplay policies and accessibility standards. Use the Audio toggle in the header to opt in when sound assets are active.',
  },
  {
    id: 'faq-scope',
    category: 'Platform Scope',
    question: 'Is RIVALRY 90 currently a full playable 11v11 online game?',
    answer:
      'No. Phases 01–10 deliver the interactive frontend website, design system, fictional universe showcase, squad builder prototype, and 3D/cinematic web architecture. Backend persistence and game-server systems belong to later phases.',
  },
  {
    id: 'faq-squad',
    category: 'Squad Builder',
    question: 'Are my Squad Builder lineups saved permanently right now?',
    answer:
      'Squad selections are managed in client-side Zustand state for live tactical experimentation. Permanent account persistence will be connected in the Supabase backend phases (Phase 11+).',
  },
  {
    id: 'faq-reduced-motion',
    category: 'Audio & Accessibility',
    question: 'Does RIVALRY 90 respect prefers-reduced-motion?',
    answer:
      'Yes. Both GSAP/3D camera auto-rotation and Motion UI transitions simplify or disable movement when your operating system has reduced motion enabled.',
  },
];
