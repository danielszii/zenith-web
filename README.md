# Zenith OS

Monorepositório da plataforma Zenith para gestão de competições esportivas. Reúne a API Node.js/TypeScript, o portal React/Vite, PostgreSQL no Supabase e a integração com o aplicativo offline.

## Arquitetura

```text
Portal web --------+
                   +--> API Zenith --> PostgreSQL (Supabase)
Aplicativo offline +        |
 WatermelonDB ------------- sync
```

O portal e o aplicativo nunca acessam o banco diretamente. Autenticação, permissões, regras da súmula e sincronização passam pela API.

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- projeto PostgreSQL/Supabase

## Configuração local

```powershell
npm install
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Preencha `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET` e `VITE_API_URL`. Depois aplique as migrations:

```powershell
npm run db:validate -w backend
npm run db:deploy -w backend
```

Para desenvolvimento com uma migration nova, use `npm run db:migrate -w backend`. Em produção, use somente `db:deploy`.

## Desenvolvimento

```powershell
npm run dev
```

- Portal: `http://localhost:5173`
- API: `http://localhost:3000`
- Saúde: `http://localhost:3000/health`
- Gestão: `http://localhost:5173/gestao`

Serviços separados: `npm run dev:backend` e `npm run dev:frontend`.

## Conta administrativa

```powershell
npm run admin:create -w backend -- --email=admin@exemplo.com --nome="Administrador"
```

O comando solicita a senha de forma segura quando necessário. Não coloque senhas em commits, documentação ou mensagens.

## Produção

### Backend

Variáveis obrigatórias:

- `NODE_ENV=production`
- `DATABASE_URL`: Transaction pooler do Supabase
- `DIRECT_URL`: conexão direta ou Session pooler para migrations
- `JWT_SECRET`: segredo longo e exclusivo
- `FRONTEND_URL`: uma ou mais origens permitidas, separadas por vírgula

Build:

```text
npm install && npm run db:deploy -w backend && npm run build -w backend
```

Start:

```text
npm run start -w backend
```

### Frontend

Variável obrigatória:

- `VITE_API_URL`: URL HTTPS pública da API, sem barra final

Build:

```text
npm install && npm run build -w frontend
```

O frontend interrompe a inicialização em produção quando `VITE_API_URL` não está configurada, evitando publicar um portal apontando para `localhost`.

## Validação

```powershell
npm audit
npm run typecheck
npm run build
```

O smoke test mobile requer a API em execução e uma configuração válida:

```powershell
npm run test:mobile -w backend
```

## Fluxo operacional

1. Cadastre clubes, atletas e campeonatos em `/gestao`.
2. Crie uma partida e atribua o mesário.
3. O aplicativo baixa o pacote e opera offline.
4. Ao reconectar, o app envia as operações para a API.
5. A API processa o lote de forma transacional e idempotente.
6. O portal atualiza placares, eventos e estatísticas.

Consulte [backend/SUPABASE_PRISMA.md](backend/SUPABASE_PRISMA.md) para detalhes de conexão e migrations.