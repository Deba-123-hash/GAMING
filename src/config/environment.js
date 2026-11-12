export const ENVIRONMENT_CONFIG = {
  isProduction: process.env.NODE_ENV === 'production',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  enable3DDevtools: process.env.NEXT_PUBLIC_ENABLE_3D_DEVTOOLS === 'true',
  enableAudioByDefault: false, // Hard-locked silent by default for UX & accessibility
};
