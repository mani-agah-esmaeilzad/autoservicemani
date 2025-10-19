#!/usr/bin/env node
import { execSync } from 'node:child_process';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log('[prisma-deploy] DATABASE_URL is not set. Skipping Prisma migrations.');
  process.exit(0);
}

const isCI = process.env.CI === 'true' || Boolean(process.env.VERCEL);
const shouldSkipInCI = process.env.PRISMA_DEPLOY_ON_BUILD !== 'true';
const explicitSkip = process.env.SKIP_PRISMA_MIGRATIONS === 'true';

if (explicitSkip || (isCI && shouldSkipInCI)) {
  const reason = explicitSkip ? 'SKIP_PRISMA_MIGRATIONS flag detected' : 'CI environment detected';
  console.log(`[prisma-deploy] ${reason}. Prisma migrations will be skipped.`);
  process.exit(0);
}

function run(command) {
  execSync(command, { stdio: 'inherit', env: process.env });
}

function runSafe(command) {
  try {
    run(command);
    return true;
  } catch (error) {
    const outputs = [error?.stderr, error?.stdout, error?.message].filter(Boolean).map((value) => value.toString());
    const combined = outputs.join('\n');
    if (combined.includes('P3009')) {
      return false;
    }
    throw error;
  }
}

const ok = runSafe('npx prisma migrate deploy');

if (!ok) {
  console.warn('[prisma-deploy] Detected failed migration (P3009). Attempting automatic recovery.');
  try {
    run('npx prisma migrate resolve --rolled-back 0001_init');
  } catch (error) {
    console.error('[prisma-deploy] Failed to mark migration as rolled back. Please resolve manually.');
    throw error;
  }
  run('npx prisma migrate deploy');
}

console.log('[prisma-deploy] Prisma migrations completed successfully.');
