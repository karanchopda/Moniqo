import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';

async function seedUser() {
  const email = 'karanchopda33@gmail.com';
  const plainPassword = 'Chopda@1234#';

  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
      },
      create: {
        email,
        password: hashedPassword,
      },
    });

    console.log('User seeded successfully:', user.email);
  } catch (error) {
    console.error('Error seeding user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUser();
