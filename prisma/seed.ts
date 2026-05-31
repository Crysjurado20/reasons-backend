import prisma from '../src/config/prisma';
import bcrypt from 'bcrypt';

async function main() {
  // 1. Hasheamos la contraseña de forma segura
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('admin123', saltRounds);

  // 2. Usamos upsert para evitar errores si el script se corre dos veces
  const adminUser = await prisma.users.upsert({
    where: { email: 'admin@reasons.uta.edu.ec' },
    update: {}, // Si ya existe, no hace nada
    create: {
      name: 'Manuel Ramírez',
      email: 'admin@reasons.uta.edu.ec',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Base de datos poblada. Administrador creado:', adminUser.email);
}

main()
  .catch((e) => {
    console.error('Error al poblar la base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
