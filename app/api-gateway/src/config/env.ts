import dotenv from 'dotenv';
import path from 'path';

process.env.DOTENV_QUIET = 'true';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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
