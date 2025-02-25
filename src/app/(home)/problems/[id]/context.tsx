import {
  SubmissionStatus,
  SubmissionTestcaseStatus,
} from "@/server/schema/enum";
import { TestCase } from "@/server/schema/testcase.schema";
import React, { createContext, useContext } from "react";
export type SubmittingTestcase = TestCase & {
  status: SubmissionTestcaseStatus;
  actualOutput?: string;
};
interface ProblemEditorContextValue {
  isShowSubmitTab: boolean;
  setIsShowSubmitTab: (value: boolean) => void;
  testcases: SubmittingTestcase[];
  setTestcases: React.Dispatch<React.SetStateAction<SubmittingTestcase[]>>;
  submissionStatus: SubmissionStatus;
  setSubmissionStatus: (value: SubmissionStatus) => void;
  tabValue: string;
  setTabValue: (value: string) => void;
  submissionId: string;
  setSubmissionId: (value: string) => void;
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
