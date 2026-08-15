import dotenv from 'dotenv';
import path from 'path';

import fs from 'fs';
process.env.DOTENV_QUIET = 'true';

// Nx can run this from the workspace root or the app root, so we check both!
const envPaths = [
  path.join(process.cwd(), '.env'),
  path.join(process.cwd(), 'app/email-service/.env')
];
for (const p of envPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: "${key}"`);
  }
  return value;
}

export const { PORT, HOST, QUEUE_URL, EXCHANGE_KEY, EMAIL_QUEUE_NAME , BREVO_KEY_1, EMAIL_ID_1} =
  process.env;
