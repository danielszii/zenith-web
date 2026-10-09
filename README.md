# Zenith OS

Monorepositório da plataforma Zenith para gestão de competições esportivas. O projeto reúne a API Node.js/TypeScript, o portal React/Vite e a integração com o aplicativo offline.

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- PostgreSQL 14 ou superior

## Configuração inicial

1. Instale as dependências na raiz:

   ```powershell
   npm install
   ```

2. Crie o banco PostgreSQL e copie os arquivos de ambiente:

   ```powershell
   Copy-Item backend/.env.example backend/.env
   Copy-Item frontend/.env.example frontend/.env
   ```

3. Preencha as credenciais do banco e o `JWT_SECRET` em `backend/.env`.

4. Aplique as migrações:

   ```powershell
   npm run db:migrate -w backend
   ```

## Desenvolvimento

Inicie a API e o portal juntos:

```powershell
npm run dev
```

- Portal: http://localhost:5173
- API: http://localhost:3000
- Saúde da API: http://localhost:3000/health
- Central de gestão: http://localhost:5173/gestao

Para iniciar os serviços separadamente, use `npm run dev:backend` e `npm run dev:frontend`.

## Fluxo da plataforma

O portal publica clubes, atletas, competições, estatísticas e partidas. A rota `/gestao`, acessada diretamente pelo endereço, concentra as operações administrativas. Usuários administradores podem cadastrar contas; administradores e gestores mantêm os dados esportivos.

O aplicativo recebe as partidas atribuídas, opera a súmula offline e sincroniza os eventos com a API. A API processa cada lote em uma transação e usa identificadores de operação para impedir duplicações durante tentativas de reenvio.

## Validação

```powershell
npm run typecheck
npm run build
npm run test:mobile -w backend
```

Segredos e artefatos de build não são versionados. Use os arquivos `.env.example` como referência.
