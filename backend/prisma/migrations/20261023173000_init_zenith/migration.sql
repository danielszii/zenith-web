-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "clubes" (
    "id_clube" UUID NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "brasao" TEXT,
    "cores_oficiais" VARCHAR(100),
    "responsavel" VARCHAR(150),
    "cnpj" VARCHAR(18),

    CONSTRAINT "clubes_pkey" PRIMARY KEY ("id_clube")
);

-- CreateTable
CREATE TABLE "campeonatos" (
    "id_campeonato" UUID NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "formato" VARCHAR(80),
    "data_inicio" DATE NOT NULL,
    "data_fim" DATE NOT NULL,
    "criterios_desempate" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'planejado',
    "modalidade" VARCHAR(20) NOT NULL,
    "categoria" VARCHAR(30),

    CONSTRAINT "campeonatos_pkey" PRIMARY KEY ("id_campeonato")
);

-- CreateTable
CREATE TABLE "campeonatos_clubes" (
    "id_campeonato" UUID NOT NULL,
    "id_clube" UUID NOT NULL,

    CONSTRAINT "campeonatos_clubes_pkey" PRIMARY KEY ("id_campeonato","id_clube")
);

-- CreateTable
CREATE TABLE "atletas" (
    "id_atleta" UUID NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "cpf" VARCHAR(14) NOT NULL,
    "rg" VARCHAR(30),
    "foto_perfil" TEXT,
    "data_nasc" DATE NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ativo',
    "peso" DECIMAL(5,2),
    "altura" DECIMAL(4,2),
    "tipo_sanguineo" VARCHAR(5) NOT NULL,
    "id_clube" UUID,

    CONSTRAINT "atletas_pkey" PRIMARY KEY ("id_atleta")
);

-- CreateTable
CREATE TABLE "partidas" (
    "id_partida" UUID NOT NULL,
    "id_campeonato" UUID NOT NULL,
    "id_mandante" UUID NOT NULL,
    "id_visitante" UUID NOT NULL,
    "data" DATE NOT NULL,
    "hora" TIME(6) NOT NULL,
    "local" VARCHAR(200) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'agendado',
    "gols_mandante" INTEGER NOT NULL DEFAULT 0,
    "gols_visitante" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "partidas_pkey" PRIMARY KEY ("id_partida")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" UUID NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha" TEXT NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "eventos_sumula" (
    "id_evento" UUID NOT NULL,
    "id_partida" UUID NOT NULL,
    "id_atleta" UUID,
    "id_clube" UUID NOT NULL,
    "tipo_evento" VARCHAR(30) NOT NULL,
    "id_atleta_assistencia" UUID,
    "minuto_evento" INTEGER,
    "timestamp_offline" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_atleta_relacionado" UUID,
    "detalhe_evento" VARCHAR(80),
    "periodo" VARCHAR(30) NOT NULL DEFAULT '1T',
    "segundo_evento" INTEGER NOT NULL DEFAULT 0,
    "sequencia" BIGINT NOT NULL DEFAULT 0,
    "cancelado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "eventos_sumula_pkey" PRIMARY KEY ("id_evento")
);

-- CreateTable
CREATE TABLE "partidas_mesarios" (
    "id_partida" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "atribuido_em" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partidas_mesarios_pkey" PRIMARY KEY ("id_partida","id_usuario")
);

-- CreateTable
CREATE TABLE "pessoas_partida" (
    "id_pessoa" UUID NOT NULL,
    "id_partida" UUID NOT NULL,
    "id_clube" UUID,
    "nome" VARCHAR(150) NOT NULL,
    "funcao" VARCHAR(40) NOT NULL,
    "documento" VARCHAR(60),

    CONSTRAINT "pessoas_partida_pkey" PRIMARY KEY ("id_pessoa")
);

-- CreateTable
CREATE TABLE "escalacoes_partida" (
    "id_partida" UUID NOT NULL,
    "id_atleta" UUID NOT NULL,
    "id_clube" UUID NOT NULL,
    "numero_camisa" INTEGER,
    "confirmado" BOOLEAN NOT NULL DEFAULT false,
    "elegivel" BOOLEAN NOT NULL DEFAULT true,
    "observacao_elegibilidade" TEXT,
    "titular" BOOLEAN NOT NULL DEFAULT false,
    "capitao" BOOLEAN NOT NULL DEFAULT false,
    "checkin_em" TIMESTAMPTZ(6),
    "atualizado_em" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "escalacoes_partida_pkey" PRIMARY KEY ("id_partida","id_atleta")
);

-- CreateTable
CREATE TABLE "assinaturas_sumula" (
    "id_assinatura" UUID NOT NULL,
    "id_partida" UUID NOT NULL,
    "nome_signatario" VARCHAR(150) NOT NULL,
    "funcao_signatario" VARCHAR(40) NOT NULL,
    "fase" VARCHAR(10) NOT NULL,
    "path_data" JSONB NOT NULL,
    "assinado_em" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "assinaturas_sumula_pkey" PRIMARY KEY ("id_assinatura")
);

-- CreateTable
CREATE TABLE "periodos_partida" (
    "id_partida" UUID NOT NULL,
    "periodo" VARCHAR(30) NOT NULL,
    "segundos" INTEGER NOT NULL DEFAULT 0,
    "em_andamento" BOOLEAN NOT NULL DEFAULT false,
    "atualizado_em" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "periodos_partida_pkey" PRIMARY KEY ("id_partida","periodo")
);

-- CreateTable
CREATE TABLE "operacoes_mobile" (
    "operation_id" VARCHAR(100) NOT NULL,
    "id_usuario" UUID NOT NULL,
    "id_partida" UUID NOT NULL,
    "entidade" VARCHAR(40) NOT NULL,
    "acao" VARCHAR(30) NOT NULL,
    "payload" JSONB NOT NULL,
    "criado_no_dispositivo" TIMESTAMPTZ(6) NOT NULL,
    "processado_em" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "operacoes_mobile_pkey" PRIMARY KEY ("operation_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clubes_cnpj_key" ON "clubes"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "atletas_cpf_key" ON "atletas"("cpf");

-- CreateIndex
CREATE INDEX "idx_partidas_campeonato" ON "partidas"("id_campeonato");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "idx_eventos_partida" ON "eventos_sumula"("id_partida");

-- CreateIndex
CREATE INDEX "idx_eventos_atleta" ON "eventos_sumula"("id_atleta");

-- CreateIndex
CREATE INDEX "idx_escalacoes_partida" ON "escalacoes_partida"("id_partida", "id_clube");

-- CreateIndex
CREATE INDEX "idx_assinaturas_partida" ON "assinaturas_sumula"("id_partida", "fase");

-- CreateIndex
CREATE UNIQUE INDEX "assinaturas_sumula_id_partida_funcao_signatario_fase_key" ON "assinaturas_sumula"("id_partida", "funcao_signatario", "fase");

-- CreateIndex
CREATE INDEX "idx_operacoes_mobile_partida" ON "operacoes_mobile"("id_partida", "processado_em");

-- AddForeignKey
ALTER TABLE "campeonatos_clubes" ADD CONSTRAINT "campeonatos_clubes_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos"("id_campeonato") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campeonatos_clubes" ADD CONSTRAINT "campeonatos_clubes_id_clube_fkey" FOREIGN KEY ("id_clube") REFERENCES "clubes"("id_clube") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atletas" ADD CONSTRAINT "atletas_id_clube_fkey" FOREIGN KEY ("id_clube") REFERENCES "clubes"("id_clube") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidas" ADD CONSTRAINT "partidas_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos"("id_campeonato") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidas" ADD CONSTRAINT "partidas_id_mandante_fkey" FOREIGN KEY ("id_mandante") REFERENCES "clubes"("id_clube") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidas" ADD CONSTRAINT "partidas_id_visitante_fkey" FOREIGN KEY ("id_visitante") REFERENCES "clubes"("id_clube") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_sumula" ADD CONSTRAINT "eventos_sumula_id_partida_fkey" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id_partida") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_sumula" ADD CONSTRAINT "eventos_sumula_id_clube_fkey" FOREIGN KEY ("id_clube") REFERENCES "clubes"("id_clube") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_sumula" ADD CONSTRAINT "eventos_sumula_id_atleta_fkey" FOREIGN KEY ("id_atleta") REFERENCES "atletas"("id_atleta") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_sumula" ADD CONSTRAINT "eventos_sumula_id_atleta_assistencia_fkey" FOREIGN KEY ("id_atleta_assistencia") REFERENCES "atletas"("id_atleta") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_sumula" ADD CONSTRAINT "eventos_sumula_id_atleta_relacionado_fkey" FOREIGN KEY ("id_atleta_relacionado") REFERENCES "atletas"("id_atleta") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidas_mesarios" ADD CONSTRAINT "partidas_mesarios_id_partida_fkey" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id_partida") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidas_mesarios" ADD CONSTRAINT "partidas_mesarios_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoas_partida" ADD CONSTRAINT "pessoas_partida_id_partida_fkey" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id_partida") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoas_partida" ADD CONSTRAINT "pessoas_partida_id_clube_fkey" FOREIGN KEY ("id_clube") REFERENCES "clubes"("id_clube") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalacoes_partida" ADD CONSTRAINT "escalacoes_partida_id_partida_fkey" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id_partida") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalacoes_partida" ADD CONSTRAINT "escalacoes_partida_id_atleta_fkey" FOREIGN KEY ("id_atleta") REFERENCES "atletas"("id_atleta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalacoes_partida" ADD CONSTRAINT "escalacoes_partida_id_clube_fkey" FOREIGN KEY ("id_clube") REFERENCES "clubes"("id_clube") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assinaturas_sumula" ADD CONSTRAINT "assinaturas_sumula_id_partida_fkey" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id_partida") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periodos_partida" ADD CONSTRAINT "periodos_partida_id_partida_fkey" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id_partida") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operacoes_mobile" ADD CONSTRAINT "operacoes_mobile_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operacoes_mobile" ADD CONSTRAINT "operacoes_mobile_id_partida_fkey" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id_partida") ON DELETE CASCADE ON UPDATE CASCADE;
