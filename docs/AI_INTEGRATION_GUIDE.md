# RIVALRY 90 — AI Integration Guide

## Provider Selection
Evaluated **Google Gemini API** (`https://ai.google.dev/gemini-api/docs`) and **OpenAI API** (`https://platform.openai.com/docs/`):
- **Selected Provider:** **Google Gemini API** (`POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`) passing `x-goog-api-key` in request headers (never in query URLs).
- **Model Configuration:** Server-only `GEMINI_API_KEY` and `GEMINI_MODEL` (`gemini-2.5-flash` default).
- **Pricing & Data Notes:** Free tier (`$0`) supports Flash prototyping with RPM/RPD limits and Google data-improvement usage; switching to a Paid tier billing account removes Google model-training retention.

## Security & Graceful Degradation
- Every AI endpoint (`POST /api/ai/chat`, `POST /api/ai/squad-analysis`, `POST /api/ai/player-analysis`) requires authenticated `r90_session`, per-user sliding-window rate limits, bounded input lengths, and prompt-injection filtering (`sanitizePromptText`).
- When `GEMINI_API_KEY` is absent, endpoints explicitly set `aiProviderConnected: false` and return an honest `deterministic-advisory-fallback` note.

