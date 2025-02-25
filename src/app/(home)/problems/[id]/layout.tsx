"use client";

import React from "react";
import { ProblemEditorProvider } from "./context";

export default function DetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isShowSubmitTab, setIsShowSubmitTab] = React.useState(false);
  const [tabValue, setTabValue] = React.useState("description");
  const [submissionId, setSubmissionId] = React.useState("");

  return (
    <ProblemEditorProvider
      value={{
        isShowSubmitTab,
        setIsShowSubmitTab,
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
