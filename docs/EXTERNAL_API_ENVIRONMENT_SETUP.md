# RIVALRY 90 — External API Environment Setup

Copy [../.env.example](../.env.example) to `.env.local` (never committed to Git). Leave blank any optional integration you are not actively testing.

| Variable | Scope | Provider | Purpose |
|---|---|---|---|
| `FOOTBALL_DATA_API_KEY` | Server-only | football-data.org v4 | Live competitions, standings & fixtures (`10 req/min` free tier) |
| `FOOTBALL_DATA_BASE_URL` | Server-only | football-data.org v4 | Defaults to `https://api.football-data.org/v4` |
| `GEMINI_API_KEY` | Server-only | Google Gemini API | AI Tactical Assistant, Squad Analysis & Player Analysis |
| `GEMINI_MODEL` | Server-only | Google Gemini API | Defaults to `gemini-2.5-flash` |
| `RESEND_API_KEY` | Server-only | Resend | Transactional password reset & verification emails |
| `EMAIL_FROM_ADDRESS` | Server-only | Resend | Verified sender address |
| `CLOUDINARY_CLOUD_NAME`, `_API_KEY`, `_API_SECRET` | Server-only | Cloudinary | Optional image CDN alongside `SUPABASE_STORAGE_BUCKET` |
| `YOUTUBE_API_KEY` | Server-only | YouTube Data API v3 | Optional video title/thumbnail lookup |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` | Public IDs | GA4 / Vercel | Privacy-safe client page telemetry |

