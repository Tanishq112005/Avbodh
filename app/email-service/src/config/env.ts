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

export const { PORT, HOST, QUEUE_URL, EXCHANGE_KEY, EMAIL_QUEUE_NAME , BREVO_KEY_1, EMAIL_ID_1} =
  process.env;
