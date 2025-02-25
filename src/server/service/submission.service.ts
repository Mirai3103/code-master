import AbstractService from "./abstract.service";
import { v4 as uuid } from "uuid";
import {
  ExecutionServiceClient,
  Language,
  Submission,
  TestCase,
  SubmissionSettings,
  SubmissionResult,
} from "../grpc/generated/execution_service";
import { Prisma, PrismaClient } from "@prisma/client";
import { RunCodeInput } from "../schema/submission.dto";
import {
  mapToSubmissionStatus,
  SubmissionStatus,
  SubmissionTestcaseStatus,
} from "../schema/enum";

// Interfaces for better type safety
interface ProblemLimits {
  timeLimitInMs: number;
  memoryLimitInKb: number;
}

interface LanguageConfig {
  memoryLimitInKb?: number;
  timeLimitInMs?: number;
  language: {
    binaryFileExt: string | null;
    compileCommand: string | null;
    runCommand: string | null;
    sourceFileExt: string | null;
  };
}

interface TestCaseData {
  testCaseId: string;
  inputData: string | null;
  expectedOutput: string | null;
}

export class SubmissionService extends AbstractService {
  constructor(
    private readonly db: PrismaClient,
    private readonly executionServiceClient: ExecutionServiceClient,
  ) {
    super(db);
  }

  private async getProblemLimits(problemId: string): Promise<ProblemLimits> {
    const problem = await this.db.problem.findUnique({
      where: { problemId },
      select: { timeLimitInMs: true, memoryLimitInKb: true },
    });

    if (!problem) {
      throw new Error(`Problem with ID ${problemId} not found`);
    }
    return problem;
  }

  private async getLanguageConfig(
    problemId: string,
    languageId: number,
  ): Promise<LanguageConfig> {
    const problemLanguage = await this.db.problemLanguage.findFirst({
      where: { languageId, problemId },
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
        `Language ID ${languageId} not supported for problem ${problemId}`,
      );
    }
    return problemLanguage;
  }

  private async getTestCases(
    problemId: string,
    isTest: boolean,
  ): Promise<TestCaseData[]> {
    const testCases = await this.db.testcase.findMany({
      where: { problemId, ...(isTest ? { isSample: true } : {}) },
      select: { testCaseId: true, inputData: true, expectedOutput: true },
    });

    if (testCases.length === 0) {
      throw new Error(`No test cases found for problem ${problemId}`);
    }
    return testCases;
  }

  private createSubmission(
    input: RunCodeInput,
    problem: ProblemLimits,
    languageConfig: LanguageConfig,
    testCases: TestCaseData[],
  ): Submission {
    const submissionId = uuid();
    return new Submission({
      id: submissionId,
      code: input.code,
      language: new Language({
        binary_file_ext: languageConfig.language.binaryFileExt ?? "",
        compile_command: languageConfig.language.compileCommand ?? "",
        run_command: languageConfig.language.runCommand ?? "",
        source_file_ext: languageConfig.language.sourceFileExt ?? "",
      }),
      memory_limit:
        (languageConfig.memoryLimitInKb ?? problem.memoryLimitInKb) * 1024,
      time_limit: languageConfig.timeLimitInMs ?? problem.timeLimitInMs,
      test_cases: testCases.map(
        (tc) =>
          new TestCase({
            id: tc.testCaseId,
            input: tc.inputData ?? "",
            expect_output: tc.expectedOutput ?? "",
          }),
      ),
      settings: new SubmissionSettings({
        with_case_sensitive: false,
        with_trim: true,
        with_whitespace: true,
      }),
    });
  }

  public async testRunCode(input: RunCodeInput) {
    const { problemId, languageId, isTest } = input;

    // Fetch required data
    const [problem, languageConfig, testCases] = await Promise.all([
      this.getProblemLimits(problemId),
      this.getLanguageConfig(problemId, languageId),
      this.getTestCases(problemId, !!isTest),
    ]);

    // Create submission
    const submission = this.createSubmission(
      input,
      problem,
      languageConfig,
      testCases,
    );

    // Save submission if not a test run
    if (!isTest) {
      const userId = await this.getCurrentUserId();
      if (!userId) throw new Error("Not authenticated");

      await this.db.submission.create({
        data: {
          submissionId: submission.id,
          code: input.code,
          languageId,
          problemId,
          status: SubmissionStatus.PENDING,
          timeExecutionInMs: 0,
          memoryUsageInKb: 0,
          userId,
        },
      });
      await this.initSubmissionTestcases(submission.id, problemId);
    }

    // Execute submission
    return this.executionServiceClient.Execute(submission);
  }

  public async initSubmissionTestcases(
    submissionId: string,
    problemId: string,
  ) {
    await this.db.submissionTestcase.deleteMany({ where: { submissionId } });
    const testCases = await this.db.testcase.findMany({
      where: { problemId },
    });

    if (testCases.length === 0) {
      throw new Error(`No test cases found for problem ${problemId}`);
    }

    const data: Prisma.SubmissionTestcaseCreateManyInput[] = testCases.map(
      (tc) => ({
        submissionId: submissionId,
        testcaseId: tc.testCaseId,
        status: SubmissionTestcaseStatus.RUNNING,
        stdout: null,
        problemId: problemId,
        runtimeInMs: 0,
        memoryUsedInKb: 0,
      }),
    );
    console.log(data);

    return this.db.submissionTestcase.createMany({ data });
  }

  public async saveDraft(input: Omit<RunCodeInput, "isTest">): Promise<string> {
    const userId = await this.getCurrentUserId();
    if (!userId) throw new Error("Not authenticated");

    const { code, languageId, problemId } = input;
    const existingDraft = await this.db.submission.findFirst({
      where: {
        userId,
        problemId,
        languageId,
        status: SubmissionStatus.DRAFT,
      },
    });

    if (existingDraft) {
      await this.db.submission.update({
        where: { submissionId: existingDraft.submissionId },
        data: { code },
      });
      return existingDraft.submissionId;
    }

    const newDraft = await this.db.submission.create({
      data: {
        submissionId: uuid(),
        code,
        languageId,
        problemId,
        status: SubmissionStatus.DRAFT,
        userId,
        timeExecutionInMs: 0,
        memoryUsageInKb: 0,
      },
    });
    return newDraft.submissionId;
  }

  public async getLatestDraft(problemId: string, languageId: number) {
    const userId = await this.getCurrentUserId();
    if (!userId) throw new Error("Not authenticated");

    return this.db.submission.findFirst({
      where: {
        userId,
        problemId,
        languageId,
        status: SubmissionStatus.DRAFT,
      },
    });
  }

  public async getBriefSubmissionById(submissionId: string) {
    return this.db.submission.findUnique({
      where: { submissionId },
      select: {
        language: {
          select: {
            languageId: true,
            languageName: true,
            version: true,
            sourceFileExt: true,
          },
        },
        userId: true,
        createdAt: true,
        code: true,
      },
    });
  }
  public async getSubmissionById(submissionId: string) {
    const submissionPromise = this.db.submission.findUnique({
      where: { submissionId },
      omit: {
        code: true,
        createdAt: true,
      },
    });
    const testcasesPromise = this.db.submissionTestcase.findMany({
      where: { submissionId },
      include: {
        testcase: {
          select: {
            label: true,
            points: true,
            testCaseId: true,
            isSample: true,
          },
        },
      },
    });
    const [submission, testcases] = await Promise.all([
      submissionPromise,
      testcasesPromise,
    ]);
    if (!submission) {
      return null;
    }
    return {
      ...submission,
      testcases: testcases,
    };
  }

  public async updateSubmissionTestcaseResult(result: SubmissionResult) {
    const {
      submission_id,
      test_case_id,
      status,
      stdout,
      memory_usage,
      time_usage,
    } = result;
    return this.db.submissionTestcase.update({
      where: {
        submissionId_testcaseId: {
          submissionId: submission_id,
          testcaseId: test_case_id,
        },
      },
      data: {
        status,
        stdout,
        memoryUsedInKb: memory_usage,
        runtimeInMs: time_usage * 1000,
      },
    });
  }

  public async recalculateSubmission(submissionId: string) {
    const submission = await this.db.submission.findUnique({
      where: { submissionId },
    });
    if (!submission) {
      throw new Error(`Submission with ID ${submissionId} not found`);
    }

    const testcases = await this.db.submissionTestcase.findMany({
      where: { submissionId },
    });

    const status = mapToSubmissionStatus(
      testcases.map((tc) => tc.status as SubmissionTestcaseStatus),
    );
    const calculateAvg = (values: number[]) =>
      values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

    const timeExecutionInMsAvg = calculateAvg(
      testcases.map((tc) => tc.runtimeInMs),
    );
    const memoryUsageInKbAvg = calculateAvg(
      testcases.map((tc) => tc.memoryUsedInKb),
    );

    return this.db.submission.update({
      where: { submissionId },
      data: {
        status,
        memoryUsageInKb: memoryUsageInKbAvg,
        timeExecutionInMs: timeExecutionInMsAvg,
      },
    });
  }
}

export type SubmissionById = NonNullable<
  Awaited<ReturnType<SubmissionService["getSubmissionById"]>>
>;

export type SubmissionBrief = Awaited<
  ReturnType<SubmissionService["getBriefSubmissionById"]>
>;
