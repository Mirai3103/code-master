import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker/locale/vi";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

const numberOfUsers = 10;

async function generateFakeUsers() {
  const userId = uuidv4();
  await prisma.user.create({
    data: {
      email: faker.internet.email(),
      id: userId,
      name: faker.person.fullName(),
      image: faker.image.avatar(),
      hashPassword: faker.internet.password(),
      emailVerified: new Date(),
      Role: {
        connect: {
          roleId: "everyone",
        },
      },
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    },
  });
  await prisma.account.create({
    data: {
      provider: "credentials",
      userId,
      providerAccountId: uuidv4(),
      type: "email",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  await prisma.profile.create({
    data: {
      bio: faker.lorem.paragraph(),
      birthdate: faker.date.past(),
      id: userId,
      location: faker.location.city(),
      image: faker.image.avatar(),
    },
  });
}

for (let i = 0; i < numberOfUsers; i++) {
  await generateFakeUsers();
}
prisma.$disconnect();
