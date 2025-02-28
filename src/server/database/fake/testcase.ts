import { Prisma, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

function genPublicTestcase(
  problemId: string,
  index: number,
): Prisma.TestcaseCreateManyInput {
  return {
    problemId,
    inputData: faker.lorem.words({
      min: 1,
      max: 10,
    }),
    expectedOutput: faker.lorem.word(),
    isSample: true,
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    createdBy: "admin",
    updatedBy: "admin",
    metadata: { isFake: true },
    label: "Testcase " + index,
    points: 0,
    index: index,
  };
}
function genPrivateTestcase(
  problemId: string,
  index: number,
): Prisma.TestcaseCreateManyInput {
  return {
    problemId,
    inputData: faker.lorem.words({
      min: 1,
      max: 10,
    }),
    expectedOutput: faker.lorem.word(),
    isSample: false,
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    createdBy: "admin",
    updatedBy: "admin",
    metadata: { isFake: true },
    label: "Testcase " + index,
    points: faker.helpers.arrayElement([10, 20, 30, 15, 25]),
    index: index,
  };
}

async function generateFakeTestcases() {
  const problems = await prisma.problem.findMany({
    include: {
      testcases: true,
    },
  });

  for (const problem of problems) {
    if (problem.testcases.length === 0) {
      const listTestcases: Prisma.TestcaseCreateManyInput[] = [];
      for (let i = 0; i < 3; i++) {
        listTestcases.push(genPublicTestcase(problem.problemId, i + 1));
      }
      const to = faker.number.int({ min: 8, max: 20 });
      for (let i = 3; i < to; i++) {
        listTestcases.push(genPrivateTestcase(problem.problemId, i + 1));
      }
      await prisma.testcase.createMany({
        data: listTestcases,
      });
    }
  }

  console.log("Fake testcases generated successfully.");
}

generateFakeTestcases()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
