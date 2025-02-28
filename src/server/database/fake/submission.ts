import { PrismaClient } from "@prisma/client";
import { SubmissionStatus } from "@/server/schema/enum";

const prisma = new PrismaClient();
const userId = "fd5559ad-11cb-4864-8620-113d49c34d32";

// console.log("Fetching available languages...");
// const listLangId = await prisma.language.findMany({
//   select: {
//     languageId: true,
//   },
// });
// console.log(`Fetched ${listLangId.length} languages.`);

// async function generateFakeSubmissions() {
//   console.log("Fetching random problems...");
//   const problems = await prisma.$queryRaw<
//     {
//       problemId: string;
//     }[]
//   >`
//     SELECT "Problem"."problemId"
//     FROM "Problem"
//     WHERE "isPublic" = true
//     ORDER BY RANDOM()
//     LIMIT ${faker.number.int({ min: 6, max: 18 })}
//     `;
//   console.log(`Fetched ${problems.length} problems.`);

//   for (const problem of problems) {
//     const numSubmissions = faker.number.int({ min: 1, max: 7 });
//     console.log(
//       `Generating ${numSubmissions} submissions for problem ${problem.problemId}...`,
//     );

//     for (let i = 0; i < numSubmissions; i++) {
//       const submissionStatus = faker.helpers.arrayElement([
//         SubmissionStatus.ACCEPTED,
//         SubmissionStatus.COMPILE_ERROR,
//         SubmissionStatus.MEMORY_LIMIT_EXCEEDED,
//         SubmissionStatus.TIME_LIMIT_EXCEEDED,
//         SubmissionStatus.WRONG_ANSWER,
//         SubmissionStatus.RUNTIME_ERROR,
//       ]);
//       const submissionId = uuidv4();
//       console.log(
//         `Creating submission ${submissionId} with status ${submissionStatus}...`,
//       );

//       const submission = await prisma.submission.create({
//         data: {
//           userId,
//           problemId: problem.problemId,
//           languageId: faker.helpers.arrayElement(listLangId).languageId,
//           code: faker.lorem.paragraph(),
//           status: submissionStatus,
//           timeExecutionInMs: faker.number.int({ min: 100, max: 5000 }),
//           memoryUsageInKb: faker.number.int({ min: 1024, max: 10240 }),
//           createdBy: userId,
//           updatedBy: userId,
//           createdAt: faker.date.recent(),
//           submissionId: submissionId,
//           submissionTime: faker.date.recent(),
//         },
//       });

//       const listTestcases = await prisma.testcase.findMany({
//         where: {
//           problemId: problem.problemId,
//         },
//         select: {
//           testCaseId: true,
//         },
//       });
//       console.log(
//         `Fetched ${listTestcases.length} test cases for problem ${problem.problemId}.`,
//       );

//       for (const testcase of listTestcases) {
//         console.log(
//           `Creating testcase result for submission ${submissionId}, testcase ${testcase.testCaseId}...`,
//         );
//         await prisma.submissionTestcase.create({
//           data: {
//             submissionId: submissionId,
//             testcaseId: testcase.testCaseId,
//             problemId: problem.problemId,
//             status: mapToSubmissionTestcaseStatus(submissionStatus),
//             stdout: faker.lorem.sentence(),
//             runtimeInMs: faker.number.int({ min: 100, max: 5000 }),
//             memoryUsedInKb: faker.number.int({ min: 1024, max: 10240 }),
//           },
//         });
//       }
//     }
//   }

//   console.log("Fake submissions generated successfully.");
// }

// await generateFakeSubmissions();

// const listSubmissionId = await prisma.submission.findMany({
//   select: {
//     submissionId: true,
//   },
// });
// console.log(
//   `Recalculating scores for ${listSubmissionId.length} submissions...`,
// );

// for await (const submissionId of listSubmissionId) {
//   console.log(`Recalculating submission ${submissionId.submissionId}...`);
//   const submission = await prisma.submission.findUnique({
//     where: { submissionId: submissionId.submissionId },
//   });
//   if (!submission) {
//     throw new Error(`Submission with ID ${submissionId} not found`);
//   }

//   const testcases = await prisma.submissionTestcase.findMany({
//     where: { submissionId: submissionId.submissionId },
//   });

//   const calculateAvg = (values: number[]) =>
//     values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

//   const timeExecutionInMsAvg = calculateAvg(
//     testcases.map((tc) => tc.runtimeInMs),
//   );
//   const memoryUsageInKbAvg = calculateAvg(
//     testcases.map((tc) => tc.memoryUsedInKb),
//   );

//   prisma.submission.update({
//     where: { submissionId: submissionId.submissionId },
//     data: {
//       memoryUsageInKb: memoryUsageInKbAvg,
//       timeExecutionInMs: timeExecutionInMsAvg,
//     },
//   });
// }

// recalculating problem acceptance rate
const listProblems = await prisma.problem.findMany({
  select: {
    problemId: true,
    submissions: {
      select: {
        status: true,
      },
    },
  },
});
console.log(
  `Recalculating acceptance rate for ${listProblems.length} problems...`,
);
for await (const problem of listProblems) {
  const acceptedSubmissions = problem.submissions.filter(
    (submission) => submission.status === SubmissionStatus.ACCEPTED,
  );
  console.log(
    `Updating problem ${problem.problemId} with ${acceptedSubmissions.length}/${problem.submissions.length} submissions...`,
  );
  await prisma.problem.update({
    where: { problemId: problem.problemId },
    data: {
      acceptedSubmissions: acceptedSubmissions.length,
      totalSubmissions: problem.submissions.length,
    },
  });
}

console.log("All submissions recalculated.");
