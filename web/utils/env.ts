/**
 * Environment variable validation utility
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID',
  'OPENAI_API_KEY',
] as const;

const optionalEnvVars = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_ANALYTICS_ENABLED',
  'RATE_LIMIT_REQUESTS',
  'RATE_LIMIT_WINDOW_MS',
] as const;

type RequiredEnvVars = typeof requiredEnvVars[number];
type OptionalEnvVars = typeof optionalEnvVars[number];
type EnvVars = RequiredEnvVars | OptionalEnvVars;

export function validateEnv(): void {
  // Skip validation during build time
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    return;
  }

  const missingVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingVars.length > 0 && process.env.NODE_ENV !== 'test') {
    console.warn(
      `Warning: Missing environment variables:\n${missingVars.join('\n')}\n` +
      'Please check env.template for required variables.'
    );
  }

  // Log optional vars that are not set
  const unsetOptionalVars = optionalEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (unsetOptionalVars.length > 0) {
    console.warn(
      'Warning: The following optional environment variables are not set:\n' +
      unsetOptionalVars.join('\n')
    );
  }
}

export function getEnvVar(key: EnvVars): string | undefined {
  return process.env[key];
}

export function getRequiredEnvVar(key: RequiredEnvVars): string {
  const value = process.env[key];
  
  // During build time, return a placeholder value
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    return 'build-placeholder';
  }

  if (!value && process.env.NODE_ENV !== 'test') {
    console.warn(`Warning: Required environment variable ${key} is not set`);
    return '';
  }

  return value || '';
} 