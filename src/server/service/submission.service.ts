import AbstractService from "./abstract.service";
import {
  type ExecutionServiceClient,
  Language,
  Submission,
  TestCase,
  SubmissionSettings,
} from "../grpc/generated/execution_service";
import { v4 as uuid } from "uuid";
import { type PrismaClient } from "@prisma/client";
import { type RunCodeInput } from "../schema/submission.dto";

export class SubmissionService extends AbstractService {
  private readonly executionServiceClient: ExecutionServiceClient;

  constructor(
    db: PrismaClient,
    executionServiceClient: ExecutionServiceClient,
  ) {
    super(db);
    this.executionServiceClient = executionServiceClient;
  }

  public async testRunCode(input: RunCodeInput) {
    const { code, languageId, problemId } = input;

    // Tìm thông tin problem
    const problem = await this.prisma.problem.findUnique({
      where: { problemId: problemId },
      select: {
        timeLimitInMs: true,
        memoryLimitInKb: true,
      },
    });

    if (!problem) {
      throw new Error(`Problem with Id ${problemId} not found.`);
    }

    // Tìm thông tin ngôn ngữ của problem
    const problemLanguage = await this.prisma.problemLanguage.findFirst({
      where: { languageId, problemId: problemId },
      select: {
        memoryLimitInKb: true,
        timeLimitInMs: true,
        language: {
          select: {
            binaryFileExt: true,
            compileCommand: true,
            runCommand: true,
            sourceFileExt: true,
          },
        },
      },
    });

    if (!problemLanguage) {
      throw new Error(
        `Language with Id ${languageId} not supported for problem ${problemId}.`,
      );
    }

    // Tìm các test case mẫu
    const problemTestCases = await this.prisma.testcase.findMany({
      where: {
        problemId: problemId,
        isSample: true,
      },
      select: {
        testCaseId: true,
        inputData: true,
        expectedOutput: true,
      },
    });
    if (problemTestCases.length === 0) {
      throw new Error(`No sample test cases found for problem ${problemId}.`);
    }

    // Tạo đối tượng Submission
    const submission = new Submission({
      code,
      id: uuid(),
      language: new Language({
        binary_file_ext: problemLanguage.language.binaryFileExt || "",
        compile_command: problemLanguage.language.compileCommand || "",
        run_command: problemLanguage.language.runCommand || "",
        source_file_ext: problemLanguage.language.sourceFileExt || "",
      }),
      memory_limit:
        (problemLanguage.memoryLimitInKb || problem.memoryLimitInKb) * 1024,
      time_limit: problemLanguage.timeLimitInMs || problem.timeLimitInMs,
      test_cases: problemTestCases.map(
        (testCase) =>
          new TestCase({
            expect_output: testCase.expectedOutput || "",
            input: testCase.inputData || "",
            id: testCase.testCaseId,
          }),
      ),
      settings: new SubmissionSettings({
        with_case_sensitive: false,
        with_trim: true,
        with_whitespace: true,
      }),
    });

    // Gọi gRPC client để thực thi submission
    const result = this.executionServiceClient.Execute(submission);

    return result;
  }
}
