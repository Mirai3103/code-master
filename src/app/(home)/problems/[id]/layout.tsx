"use client";

import React from "react";
import { ProblemEditorProvider, SubmittingTestcase } from "./context";
import { SubmissionStatus } from "@/server/schema/enum";

export default function DetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isShowSubmitTab, setIsShowSubmitTab] = React.useState(false);
  const [testcases, setTestcases] = React.useState<SubmittingTestcase[]>([]);
  const [submissionStatus, setSubmissionStatus] =
    React.useState<SubmissionStatus>(SubmissionStatus.DRAFT);
  const [tabValue, setTabValue] = React.useState("description");
  const [submissionId, setSubmissionId] = React.useState("");

  return (
    <ProblemEditorProvider
      value={{
        isShowSubmitTab,
        setIsShowSubmitTab,
        testcases,
        setTestcases,
        submissionStatus,
        setSubmissionStatus,
        tabValue,
        setTabValue,
        submissionId,
        setSubmissionId,
      }}
    >
      {children}
    </ProblemEditorProvider>
  );
}
