CREATE TABLE IF NOT EXISTS clubes (
  id_clube UUID PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  brasao TEXT,
  cores_oficiais VARCHAR(100),
  responsavel VARCHAR(150),
  cnpj VARCHAR(18) UNIQUE
);

CREATE TABLE IF NOT EXISTS campeonatos (
  id_campeonato UUID PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  formato VARCHAR(80),
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  criterios_desempate TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'planejado',
  modalidade VARCHAR(20) NOT NULL,
  categoria VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS campeonatos_clubes (
  id_campeonato UUID NOT NULL REFERENCES campeonatos(id_campeonato) ON DELETE CASCADE,
  id_clube UUID NOT NULL REFERENCES clubes(id_clube) ON DELETE CASCADE,
  PRIMARY KEY (id_campeonato, id_clube)
);

CREATE TABLE IF NOT EXISTS atletas (
  id_atleta UUID PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  rg VARCHAR(30),
  foto_perfil TEXT,
  data_nasc DATE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'ativo',
  peso NUMERIC(5,2),
  altura NUMERIC(4,2),
  tipo_sanguineo VARCHAR(5) NOT NULL,
  id_clube UUID REFERENCES clubes(id_clube) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS partidas (
  id_partida UUID PRIMARY KEY,
  id_campeonato UUID NOT NULL REFERENCES campeonatos(id_campeonato),
  id_mandante UUID NOT NULL REFERENCES clubes(id_clube),
  id_visitante UUID NOT NULL REFERENCES clubes(id_clube),
  data DATE NOT NULL,
  hora TIME NOT NULL,
  local VARCHAR(200) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'agendado',
  gols_mandante INTEGER NOT NULL DEFAULT 0,
  gols_visitante INTEGER NOT NULL DEFAULT 0,
  CHECK (id_mandante <> id_visitante),
  CHECK (status IN ('agendado', 'em_andamento', 'encerrado', 'cancelado'))
);

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario UUID PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (role IN ('admin', 'mesario', 'gestor'))
);

CREATE TABLE IF NOT EXISTS eventos_sumula (
  id_evento UUID PRIMARY KEY,
  id_partida UUID NOT NULL REFERENCES partidas(id_partida) ON DELETE CASCADE,
  id_atleta UUID REFERENCES atletas(id_atleta) ON DELETE SET NULL,
  id_clube UUID NOT NULL REFERENCES clubes(id_clube),
  tipo_evento VARCHAR(30) NOT NULL,
  id_atleta_assistencia UUID REFERENCES atletas(id_atleta) ON DELETE SET NULL,
  minuto_evento INTEGER,
  timestamp_offline TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (tipo_evento IN ('GOL', 'CARTAO_AMARELO', 'CARTAO_VERMELHO')),
  CHECK (minuto_evento IS NULL OR minuto_evento BETWEEN 0 AND 150)
);

CREATE INDEX IF NOT EXISTS idx_partidas_campeonato ON partidas(id_campeonato);
CREATE INDEX IF NOT EXISTS idx_eventos_partida ON eventos_sumula(id_partida);
CREATE INDEX IF NOT EXISTS idx_eventos_atleta ON eventos_sumula(id_atleta);
