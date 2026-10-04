# 🏆 Zenith OS — Backend API

> Sistema inteligente de gestão esportiva, automação de súmulas e processamento de dados em tempo real para ligas de futebol e futsal.

O **Zenith OS** é uma API REST desenvolvida para centralizar, proteger e automatizar a administração de competições esportivas. O sistema cobre desde o controle de acesso de oficiais até o fechamento dinâmico de súmulas em tempo real, integrando regras complexas de arbitragem e gerando payloads perfeitamente formatados para preenchimento de documentos físicos da federação.

---

## 🛠️ Tecnologias & Arquitetura

O ecossistema foi projetado sob os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, garantindo o isolamento total das regras de negócio (camada de Domínio) contra acoplamentos de infraestrutura e drivers de banco de dados.

* **Ambiente de Execução:** Node.js (v20+)
* **Linguagem:** TypeScript
* **Framework Web:** Express
* **Banco de Dados:** PostgreSQL
* **Driver de Conexão:** `pg` (Pool de conexões puras para máxima performance e controle de queries)
* **Gerenciador de Banco:** DBeaver
* **Identificadores Globais:** UUID v4 (`randomUUID` nativo do Node.js) injetado ativamente pelo domínio

---

## 📂 Estrutura Estrutural do Projeto

```text
src/
├── controllers/    # Camada de Entrada: Captura requisições, valida tipos e responde via HTTP
├── dtos/           # Data Transfer Objects: Esquemas de validação de dados de entrada
├── errors/         # Exceções Customizadas de Domínio (BadRequest, NotFound, etc.)
├── middlewares/    # Interceptadores: Handler global de erros e verificação de JWT/RBAC
├── models/         # Camada de Domínio: Entidades isoladas e fábricas estáticas de validação
├── repositories/   # Camada de Dados: Consultas SQL puras e persistência no PostgreSQL
└── services/       # Regras de Negócio: Casos de uso e orquestração do pipeline do sistema
# Integração mobile offline

Depois de configurar `backend/.env`, aplique a estrutura de sincronização:

```powershell
npm run db:migrate
```

O servidor escuta em `0.0.0.0:3000`, permitindo acesso de aparelhos na mesma rede.

Fluxo administrativo:

1. cadastre um usuário com papel `mesario`;
2. consulte `GET /mobile/mesarios` autenticado como administrador;
3. atribua a partida com `POST /mobile/partidas/:id/atribuir` e `{ "usuarioId": "..." }`;
4. o mesário entra no aplicativo e baixa o pacote em `GET /mobile/partidas/:id/pacote`;
5. o aplicativo envia ações idempotentes para `POST /mobile/sync`.

Cada lote é processado numa única transação. `operation_id` possui chave primária, portanto retries não duplicam gols, cartões ou assinaturas.
