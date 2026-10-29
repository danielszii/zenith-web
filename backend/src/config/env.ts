import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

const frontendUrls = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(value => value.trim().replace(/\/$/, ''))
  .filter(Boolean);

export const env = {
  jwtSecret: process.env.JWT_SECRET || 'zenith_local_development_only',
  port: Number(process.env.PORT || 3000),
  frontendUrls,
  supabaseUrl: process.env.SUPABASE_URL?.trim().replace(/\/$/, ''),
  supabaseSecretKey: (
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  )?.trim(),
  supabaseStorageBucket: process.env.SUPABASE_STORAGE_BUCKET?.trim() || 'zenith-media',
  isProduction: process.env.NODE_ENV === 'production',
};

if (env.isProduction && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET é obrigatório em produção.');
}

if (env.isProduction && !process.env.FRONTEND_URL) {
  throw new Error('FRONTEND_URL é obrigatória em produção.');
}
