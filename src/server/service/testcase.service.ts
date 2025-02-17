import { type PrismaClient, type Prisma } from "@prisma/client";
import { v4 as uuid } from "uuid";
import fs from "fs";
import AdmZip from "adm-zip";
import { type NewTestCaseInput } from "../schema/testcase.schema";

export class TestcaseService {
  constructor(private prisma: PrismaClient) {
    // Tạo thư mục tạm nếu chưa tồn tại
    if (!fs.existsSync("./tmp")) {
      fs.mkdirSync("./tmp");
    }
  }

  async findByProblemId(problemId: string, withAllTestcases = false) {
    const whereClause: Prisma.TestcaseWhereInput = withAllTestcases
      ? { problemId: problemId }
      : {
          problemId: problemId,
          isSample: true,
        };

    const result = await this.prisma.testcase.findMany({
      where: whereClause,
      select: {
        testCaseId: true,
        problemId: true,
        label: true,
        points: true,
        isSample: true,
      },
    });

    return result;
  }

  async findPublicTestcases(problemId: string) {
    return this.prisma.testcase.findMany({
      where: {
        problemId: problemId,
        isSample: true,
      },
    });
  }
  async findAllTestcases(problemId: string) {
    const testCases = await this.prisma.testcase.findMany({
      where: {
        problemId: problemId,
      },
      select: {
        inputData: true,
        isSample: true,
        expectedOutput: true,
        testCaseId: true,
        points: true,
        label: true,
      },
      orderBy: [{ label: "asc" }, { isSample: "desc" }, { testCaseId: "asc" }],
    });

    const processedTestCases = testCases.map((testCase) => ({
      ...testCase,
      inputData: testCase.isSample ? null : testCase.inputData,
      expectedOutput: testCase.isSample ? null : testCase.expectedOutput,
    }));

    return processedTestCases;
  }

  async findByTestcaseId(testCaseId: string) {
    return this.prisma.testcase.findUnique({
      where: { testCaseId: testCaseId },
    });
  }

  async create(data: NewTestCaseInput) {
    return this.prisma.testcase.create({
      data: {
        ...data,
        explanation: data.explanation || undefined,
      },
    });
  }

  async createMany(data: NewTestCaseInput[]) {
    return this.prisma.testcase.createMany({
      data: data.map((d) => ({
        ...d,
        explanation: d.explanation || undefined,
      })),
      skipDuplicates: true,
    });
  }

  async update(data: NewTestCaseInput & { testCaseId: string }) {
    return this.prisma.testcase.update({
      where: { testCaseId: data.testCaseId },
      data: {
        ...data,
        explanation: data.explanation || undefined,
      },
    });
  }

  async delete(testCaseId: string) {
    return this.prisma.testcase.delete({
      where: { testCaseId: testCaseId },
    });
  }

  async clearTestcases(problemId: string) {
    return this.prisma.testcase.deleteMany({
      where: { problemId: problemId },
    });
  }

  async uploadTestcasesFromZip(problemId: string, zipfile: File) {
    // Lưu file zip tạm thời
    const id = uuid();
    const filePath = `./tmp/${id}.zip`;

    await fs.promises.writeFile(
      filePath,
      Buffer.from(await zipfile.arrayBuffer()),
    );

    // Đọc file zip
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();

    const testcaseMap = new Map<string, { input?: string; output?: string }>();

    // Phân loại file input/output
    zipEntries.forEach((entry) => {
      const match = /^(input|output)\.(.+)\.txt$/.exec(entry.entryName);
      if (match) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, type, label] = match;
        console.log(type, label);
        const content = entry.getData().toString("utf8");

        if (!testcaseMap.has(label || "")) {
          testcaseMap.set(label || "", {});
        }

        const testcase = testcaseMap.get(label || "")!;
        if (type === "input") {
          testcase.input = content;
        } else {
          testcase.output = content;
        }
      }
    });

    // Chuyển map thành array
    const testcases = Array.from(testcaseMap.entries())
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, testcase]) => testcase.input && testcase.output)
      .map(([label, testcase]) => ({
        label,
        inputData: testcase.input!,
        expectedOutput: testcase.output!,
        problemId: problemId,
        points: 1,
        isSample: false,
      }));

    // Xóa file zip tạm
    await fs.promises.unlink(filePath);

    if (testcases.length === 0) {
      return false;
    }

    await this.prisma.testcase.createMany({
      data: testcases,
    });

    return true;
  }

  async bulkDelete(testCaseIds: string[]) {
    const result = await this.prisma.testcase.deleteMany({
      where: {
        testCaseId: { in: testCaseIds },
      },
    });
    return result.count;
  }
}
