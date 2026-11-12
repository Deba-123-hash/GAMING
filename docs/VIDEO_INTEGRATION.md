# RIVALRY 90 — Video Integration Guide

- **Service:** [videoService.js](file:///D:/GAMING/src/services/external/videoService.js) supports optional **YouTube Data API v3** (`YOUTUBE_API_KEY`, server-only) (`https://developers.google.com/youtube/v3`).
- **Safe Privacy-Enhanced Embed Fallback:** `buildSafeYouTubeEmbedUrl(videoId)` sanitizes IDs strictly (`/[^a-zA-Z0-9_-]/g`) and generates `https://www.youtube-nocookie.com/embed/{id}` URLs cleanly even when `YOUTUBE_API_KEY` is unset.
- **IP Compliance:** Only authorized showcase trailers and developer reels may be embedded; copyrighted third-party broadcasts are prohibited.

