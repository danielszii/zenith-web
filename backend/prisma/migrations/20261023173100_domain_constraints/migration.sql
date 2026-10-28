-- Regras de dominio que nao sao representadas diretamente no schema Prisma.
ALTER TABLE "partidas"
  ADD CONSTRAINT "partidas_clubes_distintos_check"
  CHECK ("id_mandante" <> "id_visitante"),
  ADD CONSTRAINT "partidas_status_check"
  CHECK ("status" IN ('agendado', 'em_andamento', 'encerrado', 'cancelado'));

ALTER TABLE "usuarios"
  ADD CONSTRAINT "usuarios_role_check"
  CHECK ("role" IN ('admin', 'mesario', 'gestor'));

ALTER TABLE "eventos_sumula"
  ADD CONSTRAINT "eventos_sumula_tipo_evento_check"
  CHECK ("tipo_evento" IN (
    'GOL',
    'CARTAO_AMARELO',
    'CARTAO_VERMELHO',
    'SUBSTITUICAO',
    'FALTA',
    'PEDIDO_TEMPO'
  )),
  ADD CONSTRAINT "eventos_sumula_minuto_evento_check"
  CHECK ("minuto_evento" IS NULL OR "minuto_evento" BETWEEN 0 AND 150);

ALTER TABLE "assinaturas_sumula"
  ADD CONSTRAINT "assinaturas_sumula_fase_check"
  CHECK ("fase" IN ('PRE', 'POST'));

-- O frontend e o aplicativo nao acessam o Supabase diretamente. Sem policies,
-- anon/authenticated ficam bloqueados; a API usa a conexao PostgreSQL privada.
ALTER TABLE "clubes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "campeonatos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "campeonatos_clubes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "atletas" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "partidas" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "usuarios" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "eventos_sumula" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "partidas_mesarios" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pessoas_partida" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "escalacoes_partida" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "assinaturas_sumula" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "periodos_partida" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "operacoes_mobile" ENABLE ROW LEVEL SECURITY;
