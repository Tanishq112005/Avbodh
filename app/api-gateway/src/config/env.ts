import dotenv from 'dotenv';
import path from 'path';

import fs from 'fs';
process.env.DOTENV_QUIET = 'true';

// Nx can run this from the workspace root or the app root, so we check both!
const envPaths = [
  path.join(process.cwd(), '.env'),
  path.join(process.cwd(), 'app/api-gateway/.env')
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

export const {
  PORT,
  AUTHSERVICEURL,
  AGENTSERVICEURL,
  HOST,
  INTERNAL_API_SECRET,
  JWT_SECERTS
} = process.env;
