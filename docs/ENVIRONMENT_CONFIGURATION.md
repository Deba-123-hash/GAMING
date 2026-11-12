# Environment Configuration

Copy `.env.example` to `.env.local` for local development. Never commit `.env.local` or secret keys to version control.

## Public Variables (`NEXT_PUBLIC_*`)
| Variable | Purpose | Required Now |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin URL for metadata and redirects | Optional (defaults to `http://localhost:3000`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL for browser client integration | Phase 19+ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase anonymous key (safe for client, guarded by RLS) | Phase 19+ |

## Server-Only Variables (Never Expose to Client)
| Variable | Purpose | Required Now |
|---|---|---|
| `NODE_ENV` | Runtime mode (`development`, `test`, `production`) | Automatic |
| `AUTH_SESSION_SECRET` | HMAC-SHA256 signing secret for `r90_session` cookies | Optional in dev (ephemeral random fallback generated at runtime) |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged server database access key | Phase 19+ |
| `RESEND_API_KEY` | Live transactional email API key | Optional (reports `emailDeliveryConfigured: false` when absent) |
| `EMAIL_FROM_ADDRESS` | Sender address for transactional emails | Optional |
| `SUPABASE_STORAGE_BUCKET` | Target storage bucket for avatar/media uploads | Phase 19+ (`rivalry90-public-assets` default) |

