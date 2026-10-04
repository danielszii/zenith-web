import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

export const env = {
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_local',
  port: Number(process.env.PORT || 3000),
};
