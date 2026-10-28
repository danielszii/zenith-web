import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const directUrl = process.env.DIRECT_URL?.trim();
const runtimeUrl = process.env.DATABASE_URL?.trim();
const command = process.argv.slice(2).join(' ');
const requiresRealDatabase =
  /\bmigrate\b|\bstudio\b|\bdb\s+(pull|push|execute)\b/.test(command);

if (requiresRealDatabase && !directUrl) {
  throw new Error(
    'DIRECT_URL e obrigatoria para migrations e ferramentas do banco. ' +
      'Copie a Direct connection (ou Session pooler) do novo projeto Supabase para backend/.env.',
  );
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  // A URL local ficticia permite formatar, validar e gerar o Client sem abrir
  // conexao. Operacoes que acessam o banco exigem DIRECT_URL acima.
  datasource: {
    url:
      directUrl ||
      runtimeUrl ||
      'postgresql://postgres:postgres@localhost:5432/zenith_prisma_codegen',
  },
});
