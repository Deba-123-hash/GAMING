import { getRuntimeConfig } from '@/server/config/serverConfig';
import { getDatabaseStatus } from '@/server/database/databaseClient';

export function getHealthPayload() {
  const config = getRuntimeConfig();
  const database = getDatabaseStatus();

  return {
    service: 'rivalry90-api',
    status: 'healthy',
    environment: config.nodeEnv,
    database,
    emailDeliveryConfigured: config.isEmailConfigured,
    timestamp: new Date().toISOString(),
  };
}

export function getVersionPayload() {
  const config = getRuntimeConfig();
  return {
    name: config.appName,
    apiVersion: config.apiVersion,
    appVersion: config.appVersion,
  };
}
