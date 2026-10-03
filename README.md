# Zenith OS

Monorepositório da plataforma de gestão de campeonatos, com API Node.js/TypeScript, frontend React/Vite e PostgreSQL.

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- PostgreSQL 14 ou superior

## Preparação inicial

1. Instale as dependências na raiz:

   ```powershell
   npm install
   ```

2. Crie o banco `zenith_db` no PostgreSQL e execute `backend/database/schema.sql` nele.

3. Copie os arquivos de ambiente:

   ```powershell
   Copy-Item backend/.env.example backend/.env
   Copy-Item frontend/.env.example frontend/.env
   ```

4. Ajuste `DB_PASSWORD` e `JWT_SECRET` em `backend/.env`.

## Desenvolvimento

Inicie frontend e backend juntos:

```powershell
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3000
- Saúde da API: http://localhost:3000/health

Também é possível iniciar os serviços separadamente com `npm run dev:backend` e `npm run dev:frontend`.

## Validação

```powershell
npm run typecheck
npm run build
```

Variáveis reais e artefatos de build não são versionados. Use os arquivos `.env.example` como referência.
