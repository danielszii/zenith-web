# Zenith OS API

API REST do Zenith OS para autenticação, gestão esportiva, partidas em tempo real e sincronização do aplicativo offline.

## Tecnologias

- Node.js e TypeScript
- Express
- PostgreSQL com `pg`
- JWT e controle de acesso por perfil
- `class-validator` para validação das entradas

## Estrutura

```text
src/
├── config/        # ambiente, banco e migrações
├── controllers/   # entrada e resposta HTTP
├── dtos/          # validação dos dados de entrada
├── errors/        # erros de domínio e HTTP
├── middlewares/   # autenticação, autorização e erros
├── models/        # tipos e entidades
├── repositories/  # persistência PostgreSQL
├── routes/        # rotas públicas, administrativas e mobile
├── services/      # regras de negócio
└── scripts/       # migrações, smoke tests e utilitários
```

## Comandos

Execute a partir da raiz do monorepositório:

```powershell
npm run db:migrate -w backend
npm run dev:backend
npm run typecheck -w backend
npm run build -w backend
npm run test:mobile -w backend
```

O servidor usa a porta `3000` e escuta em `0.0.0.0`, permitindo acesso por dispositivos conectados à mesma rede.

## Sincronização mobile

1. Um administrador cria o usuário com papel `mesario`.
2. O administrador consulta `GET /mobile/mesarios` e atribui uma partida em `POST /mobile/partidas/:id/atribuir`.
3. O mesário autenticado baixa o pacote em `GET /mobile/partidas/:id/pacote`.
4. O aplicativo registra a súmula localmente e envia as ações para `POST /mobile/sync`.

Cada lote é processado em uma transação. O `operation_id` torna os reenvios idempotentes, evitando duplicação de gols, cartões, substituições e assinaturas.

Consulte `.env.example` para configurar banco, JWT, CORS e porta. Em produção, `JWT_SECRET` é obrigatório.
