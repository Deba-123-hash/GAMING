import { fetchWithReliability } from '@/lib/integrations/httpClient';
import { recordIntegrationProbe } from '@/lib/integrations/integrationRegistry';

export function buildSafeYouTubeEmbedUrl(videoId) {
  const cleanId = String(videoId || '')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 20);
  if (!cleanId) return null;
  return `https://www.youtube-nocookie.com/embed/${cleanId}`;
}

export async function fetchYouTubeVideoMetadata(videoId) {
  const apiKey = process.env.YOUTUBE_API_KEY || '';
  const cleanId = String(videoId || '')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 20);
  if (!cleanId) {
    return { configured: Boolean(apiKey), found: false, item: null };
  }

  if (!apiKey) {
    return {
      configured: false,
      found: false,
      embedUrl: buildSafeYouTubeEmbedUrl(cleanId),
      message: 'YOUTUBE_API_KEY is not configured; returning privacy-enhanced embed URL only.',
    };
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${encodeURIComponent(
      cleanId
    )}&key=${encodeURIComponent(apiKey)}`;
    const { data } = await fetchWithReliability({
      providerId: 'youtube-video',
      url,
      timeoutMs: 5000,
    });
    recordIntegrationProbe('youtube-video', { ok: true });
    const snippet = data?.items?.[0]?.snippet;
    return {
      configured: true,
      found: Boolean(snippet),
      embedUrl: buildSafeYouTubeEmbedUrl(cleanId),
      item: snippet
        ? {
            id: cleanId,
            title: snippet.title,
            channelTitle: snippet.channelTitle,
            thumbnailUrl: snippet.thumbnails?.high?.url || null,
          }
        : null,
    };
  } catch (err) {
    recordIntegrationProbe('youtube-video', { ok: false, error: err.message });
    throw err;
  }
}
