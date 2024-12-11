// Execute: npx ts-node util/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
  // Clear existing data
  await prisma.tag.deleteMany();
  await prisma.media.deleteMany();
  await prisma.intensity.deleteMany();
  await prisma.user.deleteMany();
  await prisma.game.deleteMany();

  // Create tags
  await prisma.tag.createMany({
    data: [
      { tag: "Buiten" },
      { tag: "Binnen" },
      { tag: "Op een plein" },
      { tag: "9-10 jaar" }
    ]
  });

  // Create intensities
  await prisma.intensity.createMany({
    data: [
      { intensity: "Rustig", order: 1 },
      { intensity: "Matig", order: 2 },
      { intensity: "Zwaar", order: 3 },
      { intensity: "Hevig", order: 4 },
      { intensity: "Extreem", order: 5 }
    ]
  });

  // Create users
  const hashedPassword = await bcrypt.hash("password123", 10);
  await prisma.user.create({
    data: {
      username: "JohnD",
      email: "john@jeugdwerk.org",
      password: hashedPassword
    }
  });
};

(async () => {
  try {
    await main();
    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
