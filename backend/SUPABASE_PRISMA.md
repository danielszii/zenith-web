# Supabase + Prisma no Zenith

O banco continua sendo PostgreSQL. Supabase hospeda o banco; Prisma define o
schema, executa migrations e centraliza o acesso da API.

## Arquitetura

```text
Site ---------+
              +--> API Zenith (Render) --> Prisma --> Supabase PostgreSQL
App offline --+
```

O site e o aplicativo nao devem receber a senha do banco nem consultar as
tabelas diretamente. O aplicativo mantem o WatermelonDB local e sincroniza
pela API. A API valida login, permissao, idempotencia e regras da sumula.

## 1. Copiar as duas conexoes no Supabase

No projeto Supabase, abra **Connect**.

- Para `DATABASE_URL`, copie **Transaction pooler** (porta `6543`). Essa URL e
  usada pela API em execucao.
- Para `DIRECT_URL`, copie **Direct connection** (porta `5432`). Se a sua rede
  ou o Render nao alcançar IPv6, use **Session pooler** (porta `5432`). Essa URL
  e usada somente por migrations, introspeccao e Prisma Studio.

Nao envie essas URLs em mensagens, screenshots ou commits: elas contem a senha
do banco.

## 2. Configurar o ambiente local

Copie `backend/.env.example` para `backend/.env` e substitua os placeholders:

```env
DATABASE_URL="postgresql://...:6543/postgres?sslmode=require&pgbouncer=true&connection_limit=5"
DIRECT_URL="postgresql://...:5432/postgres?sslmode=require"
JWT_SECRET="um-segredo-longo-e-exclusivo"
```

Se a senha tiver caracteres como `@`, `#`, `%`, `/` ou `:`, use a senha já
codificada presente na URL fornecida pelo painel ou aplique URL encoding.

## 3. Criar as tabelas no projeto novo

Na pasta `backend`:

```powershell
npm install
npm run db:validate
npm run db:deploy
```

`db:deploy` aplica somente migrations versionadas e e o comando correto para
Supabase/Render. Nao use `db:migrate` em producao; ele e destinado ao
desenvolvimento e pode criar migration nova.

## 4. Conferir o banco

```powershell
npm run db:studio
```

No Supabase, abra **Table Editor** e confirme as tabelas `clubes`,
`campeonatos`, `atletas`, `partidas`, `usuarios`, `eventos_sumula` e as tabelas
do fluxo mobile. RLS fica habilitado sem policies publicas: anon e
authenticated nao acessam as tabelas; somente a conexao privada da API.

## 5. Configurar o Render

No servico do backend, crie as variaveis:

- `DATABASE_URL`: Transaction pooler do Supabase;
- `DIRECT_URL`: Direct connection ou Session pooler;
- `JWT_SECRET`: segredo forte e exclusivo;
- `FRONTEND_URL`: URL publica do site;
- `NODE_ENV=production`.

Build command:

```text
npm install && npm run db:deploy -w backend && npm run build -w backend
```

Start command:

```text
npm run start -w backend
```

Se o Render estiver configurado com `Root Directory=backend`, remova `-w
backend` dos comandos.

## 6. Validar a integracao

1. Abra o endpoint de saude da API.
2. Crie ou consulte um campeonato no site.
3. Crie uma partida no site e atribua um mesario.
4. Entre no aplicativo e baixe a partida.
5. Registre um evento offline, reconecte e sincronize.
6. Confirme o evento no site e em `operacoes_mobile` no Supabase.

Cada operacao mobile possui `operation_id` unico. Reenvios nao duplicam gols,
cartoes ou assinaturas, e todo lote e processado em uma transacao Prisma.

## Comandos cotidianos

```powershell
npm run db:generate   # regenera o Prisma Client
npm run db:format     # formata schema.prisma
npm run db:validate   # valida schema/configuracao
npm run db:migrate    # cria migration no desenvolvimento
npm run db:deploy     # aplica migrations pendentes
npm run db:studio     # interface local para inspecionar dados
```

Nunca use `prisma db push` no banco de producao: ele altera o schema sem criar
historico de migration.
