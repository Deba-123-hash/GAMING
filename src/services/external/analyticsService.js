/**
 * Privacy-safe analytics helper descriptors.
 * Never transmits PII, email addresses, tokens, or private squad rosters.
 */
export function getAnalyticsConfiguration() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
  const vercelId = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID || '';
  return {
    configured: Boolean(gaId || vercelId),
    providers: {
      googleAnalytics4: Boolean(gaId),
      vercelAnalytics: Boolean(vercelId),
    },
    privacyGuarantees: [
      'No email or user credentials tracked',
      'No private squad player arrays or tactics transmitted',
      'Respects navigator.doNotTrack when enabled in client wrappers',
    ],
  };
}

export function sanitizeAnalyticsEvent(eventName, props = {}) {
  const allowedKeys = ['page', 'category', 'entitySlug', 'formation', 'gameMode'];
  const safeProps = {};
  for (const key of allowedKeys) {
    if (props[key] !== undefined && props[key] !== null) {
      safeProps[key] = String(props[key]).slice(0, 80);
    }
  }
  return {
    eventName: String(eventName || 'page_view').slice(0, 60),
    properties: safeProps,
    timestamp: new Date().toISOString(),
  };
}

