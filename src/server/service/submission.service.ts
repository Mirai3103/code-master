import AbstractService from "./abstract.service";
import { v4 as uuid } from "uuid";
import {
  ExecutionServiceClient,
  Submission,
  SubmissionResult,
} from "../grpc/protos/execution_service";
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
    return {
      id: submissionId,
      code: input.code,
      language: {
        binaryFileExt: languageConfig.language.binaryFileExt ?? "",
        compileCommand: languageConfig.language.compileCommand ?? "",
        runCommand: languageConfig.language.runCommand ?? "",
        sourceFileExt: languageConfig.language.sourceFileExt ?? "",
      },
      memoryLimitInKb:
        languageConfig.memoryLimitInKb ?? problem.memoryLimitInKb,
      timeLimitInMs: languageConfig.timeLimitInMs ?? problem.timeLimitInMs,
      testCases: testCases.map((tc) => ({
        id: tc.testCaseId,
        input: tc.inputData ?? "",
        expectOutput: tc.expectedOutput ?? "",
        inputFile: "",
        outputFile: "",
      })),
      settings: {
        withCaseSensitive: false,
        withTrim: true,
        withWhitespace: true,
      },
    };
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
    return this.executionServiceClient.execute(submission);
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
      orderBy: {
        testcase: {
          label: "asc",
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
      submissionId,
      testCaseId,
      status,
      stdout,
      memoryUsageInKb,
      timeUsageInMs,
    } = result;
    return this.db.submissionTestcase.update({
      where: {
        submissionId_testcaseId: {
          submissionId: submissionId,
          testcaseId: testCaseId,
        },
      },
      data: {
        status,
        stdout,
        memoryUsedInKb: memoryUsageInKb,
        runtimeInMs: timeUsageInMs,
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

  public async getSubmissionsHistory(problemId: string, userId: string) {
    return this.db.submission.findMany({
      where: { problemId, userId },
      select: {
        language: {
          select: {
            languageName: true,
            version: true,
          },
        },
        languageId: true,
        submissionId: true,
        status: true,
        timeExecutionInMs: true,
        memoryUsageInKb: true,
        submissionTime: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

export type SubmissionById = NonNullable<
  Awaited<ReturnType<SubmissionService["getSubmissionById"]>>
>;

export type SubmissionBrief = Awaited<
  ReturnType<SubmissionService["getBriefSubmissionById"]>
>;
