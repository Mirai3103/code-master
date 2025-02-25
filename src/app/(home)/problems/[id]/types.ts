// types.ts
import { Problem } from "@/server/schema/problem.schema";
import { SubmissionTestcaseStatus } from "@/server/schema/enum";
import { TestCase } from "@/server/schema/testcase.schema";
import { type LanguageOfProblem as BeType } from "@/server/service/problem.service";
export type LanguageOfProblem = BeType;

export type TestCaseWithStatus = TestCase & {
  status: SubmissionTestcaseStatus;
  actualOutput?: string;
};

export interface EditorProps {
  problem: Problem;
  languagesOfProblem: LanguageOfProblem[];
  publicTestcases: TestCase[];
}

export interface StatusConfig {
  badge: string;
  textColor?: string;
}
