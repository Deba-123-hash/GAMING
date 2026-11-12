import { fetchWithReliability } from '@/lib/integrations/httpClient';
import {
  getIntegrationState,
  recordIntegrationProbe,
} from '@/lib/integrations/integrationRegistry';

export async function sendTransactionalEmail({ to, subject, html, text = '' }) {
  const state = getIntegrationState('resend-email');
  const apiKey = process.env.RESEND_API_KEY || '';
  const from = process.env.EMAIL_FROM_ADDRESS || 'noreply@example.com';

  if (!state.enabled || !apiKey) {
    return {
      configured: Boolean(apiKey),
      sent: false,
      provider: 'resend',
      message: 'RESEND_API_KEY not configured; transactional email not sent.',
    };
  }

  // Prevent real external email dispatch during automated Vitest/CI runs
  if (process.env.NODE_ENV === 'test') {
    return {
      configured: true,
      sent: false,
      testSuppressed: true,
      provider: 'resend',
      message: 'Email dispatch suppressed safely in test environment.',
    };
  }

  try {
    const { data } = await fetchWithReliability({
      providerId: 'resend-email',
      url: 'https://api.resend.com/emails',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, html, text }),
      timeoutMs: 6000,
    });

    recordIntegrationProbe('resend-email', { ok: true });
    return {
      configured: true,
      sent: true,
      provider: 'resend',
      messageId: data?.id || null,
    };
  } catch (err) {
    recordIntegrationProbe('resend-email', { ok: false, error: err.message });
    throw err;
  }
}

