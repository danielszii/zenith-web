-- Dados pessoais complementares podem ser preenchidos posteriormente.
ALTER TABLE "atletas"
  ALTER COLUMN "cpf" DROP NOT NULL,
  ALTER COLUMN "tipo_sanguineo" DROP NOT NULL;

-- As constraints UNIQUE existentes continuam válidas para valores informados;
-- o PostgreSQL permite vários NULLs sem gerar conflito.
