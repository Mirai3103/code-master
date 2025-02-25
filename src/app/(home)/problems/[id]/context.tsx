import { SubmissionTestcaseStatus } from "@/server/schema/enum";
import { TestCase } from "@/server/schema/testcase.schema";
import { Submission, SubmissionTestcase } from "@prisma-generated/zod";
import React, { createContext, useContext } from "react";
export type SubmittingTestcase = TestCase & {
  status: SubmissionTestcaseStatus;
  actualOutput?: string;
};
export type SubmissionDetail = Submission & { testcases: SubmissionTestcase[] };
interface ProblemEditorContextValue {
  isShowSubmitTab: boolean;
  setIsShowSubmitTab: (value: boolean) => void;
  submissionId: string;
  setSubmissionId: (value: string) => void;
  tabValue: string;
  setTabValue: (value: string) => void;
}

const ProblemEditorContext = createContext<
  ProblemEditorContextValue | undefined
>(undefined);

interface ProblemEditorProviderProps {
  children: React.ReactNode;
  value: ProblemEditorContextValue;
}

export function ProblemEditorProvider({
  children,
  value,
}: ProblemEditorProviderProps) {
  return (
    <ProblemEditorContext.Provider value={value}>
      {children}
    </ProblemEditorContext.Provider>
  );
}

export function useProblemEditorContext() {
  const context = useContext(ProblemEditorContext);
  if (context === undefined) {
    throw new Error(
      "useProblemEditorContext must be used within a ProblemEditorProvider",
    );
  }
  return context;
}
