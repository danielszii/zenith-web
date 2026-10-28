import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';

const name = process.env.ADMIN_NAME?.trim() || 'Administrador Zenith';
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

function validateInput() {
  if (!email || !email.includes('@')) {
    throw new Error('Defina ADMIN_EMAIL com um e-mail valido.');
  }

  if (!password || password.length < 12) {
    throw new Error('Defina ADMIN_PASSWORD com pelo menos 12 caracteres.');
  }
}

async function main() {
  validateInput();

  const existing = await prisma.usuario.findUnique({ where: { email } });
  if (existing) {
    throw new Error(
      'Ja existe um usuario com esse e-mail. O bootstrap nao altera senhas existentes.',
    );
  }

  const passwordHash = await bcrypt.hash(password!, 12);
  const admin = await prisma.usuario.create({
    data: {
      id_usuario: randomUUID(),
      nome: name,
      email: email!,
      senha: passwordHash,
      role: 'admin',
    },
    select: {
      id_usuario: true,
      nome: true,
      email: true,
      role: true,
      created_at: true,
    },
  });

  console.log('Administrador inicial criado com sucesso:');
  console.log(JSON.stringify(admin, null, 2));
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
