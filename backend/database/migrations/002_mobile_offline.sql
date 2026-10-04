BEGIN;

CREATE TABLE IF NOT EXISTS partidas_mesarios (
  id_partida UUID NOT NULL REFERENCES partidas(id_partida) ON DELETE CASCADE,
  id_usuario UUID NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  atribuido_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id_partida, id_usuario)
);

CREATE TABLE IF NOT EXISTS pessoas_partida (
  id_pessoa UUID PRIMARY KEY,
  id_partida UUID NOT NULL REFERENCES partidas(id_partida) ON DELETE CASCADE,
  id_clube UUID REFERENCES clubes(id_clube) ON DELETE SET NULL,
  nome VARCHAR(150) NOT NULL,
  funcao VARCHAR(40) NOT NULL,
  documento VARCHAR(60)
);

CREATE TABLE IF NOT EXISTS escalacoes_partida (
  id_partida UUID NOT NULL REFERENCES partidas(id_partida) ON DELETE CASCADE,
  id_atleta UUID NOT NULL REFERENCES atletas(id_atleta) ON DELETE CASCADE,
  id_clube UUID NOT NULL REFERENCES clubes(id_clube),
  numero_camisa INTEGER,
  confirmado BOOLEAN NOT NULL DEFAULT FALSE,
  elegivel BOOLEAN NOT NULL DEFAULT TRUE,
  observacao_elegibilidade TEXT,
  titular BOOLEAN NOT NULL DEFAULT FALSE,
  capitao BOOLEAN NOT NULL DEFAULT FALSE,
  checkin_em TIMESTAMPTZ,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id_partida, id_atleta)
);

CREATE TABLE IF NOT EXISTS assinaturas_sumula (
  id_assinatura UUID PRIMARY KEY,
  id_partida UUID NOT NULL REFERENCES partidas(id_partida) ON DELETE CASCADE,
  nome_signatario VARCHAR(150) NOT NULL,
  funcao_signatario VARCHAR(40) NOT NULL,
  fase VARCHAR(10) NOT NULL CHECK (fase IN ('PRE', 'POST')),
  path_data JSONB NOT NULL,
  assinado_em TIMESTAMPTZ NOT NULL,
  UNIQUE (id_partida, funcao_signatario, fase)
);

CREATE TABLE IF NOT EXISTS periodos_partida (
  id_partida UUID NOT NULL REFERENCES partidas(id_partida) ON DELETE CASCADE,
  periodo VARCHAR(30) NOT NULL,
  segundos INTEGER NOT NULL DEFAULT 0,
  em_andamento BOOLEAN NOT NULL DEFAULT FALSE,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id_partida, periodo)
);

CREATE TABLE IF NOT EXISTS operacoes_mobile (
  operation_id VARCHAR(100) PRIMARY KEY,
  id_usuario UUID NOT NULL REFERENCES usuarios(id_usuario),
  id_partida UUID NOT NULL REFERENCES partidas(id_partida) ON DELETE CASCADE,
  entidade VARCHAR(40) NOT NULL,
  acao VARCHAR(30) NOT NULL,
  payload JSONB NOT NULL,
  criado_no_dispositivo TIMESTAMPTZ NOT NULL,
  processado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE eventos_sumula ADD COLUMN IF NOT EXISTS id_atleta_relacionado UUID REFERENCES atletas(id_atleta) ON DELETE SET NULL;
ALTER TABLE eventos_sumula ADD COLUMN IF NOT EXISTS detalhe_evento VARCHAR(80);
ALTER TABLE eventos_sumula ADD COLUMN IF NOT EXISTS periodo VARCHAR(30) NOT NULL DEFAULT '1T';
ALTER TABLE eventos_sumula ADD COLUMN IF NOT EXISTS segundo_evento INTEGER NOT NULL DEFAULT 0;
ALTER TABLE eventos_sumula ADD COLUMN IF NOT EXISTS sequencia BIGINT NOT NULL DEFAULT 0;
ALTER TABLE eventos_sumula ADD COLUMN IF NOT EXISTS cancelado BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE eventos_sumula ALTER COLUMN id_atleta DROP NOT NULL;

ALTER TABLE eventos_sumula DROP CONSTRAINT IF EXISTS eventos_sumula_tipo_evento_check;
ALTER TABLE eventos_sumula ADD CONSTRAINT eventos_sumula_tipo_evento_check
  CHECK (tipo_evento IN ('GOL', 'CARTAO_AMARELO', 'CARTAO_VERMELHO', 'SUBSTITUICAO', 'FALTA', 'PEDIDO_TEMPO'));

CREATE INDEX IF NOT EXISTS idx_operacoes_mobile_partida ON operacoes_mobile(id_partida, processado_em);
CREATE INDEX IF NOT EXISTS idx_escalacoes_partida ON escalacoes_partida(id_partida, id_clube);
CREATE INDEX IF NOT EXISTS idx_assinaturas_partida ON assinaturas_sumula(id_partida, fase);

COMMIT;
