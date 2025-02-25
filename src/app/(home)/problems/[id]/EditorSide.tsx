"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/app/_components/ui/resizable";
import { EditorProps } from "./types";
import { EditorToolbar } from "./_components/EditorToolbar";
import { CodeEditorPanel } from "./_components/CodeEditorPanel";
import { TestResultPanel } from "./_components/TestResultPanel";
import { useEditor } from "./_hooks/useEditor";
import { useTestcases } from "./_hooks/useTestcases";
import { useProblemEditorContext } from "./context";
import { trpc } from "@/trpc/react";
import { RunCodeInput } from "@/server/schema/submission.dto";

export default function EditorSide({
  problem,
  languagesOfProblem,
  publicTestcases,
}: EditorProps) {
  // Initialize editor hooks
  const {
    selectedLanguage,
    setSelectedLanguage,
    isTestResultOpen,
    codePanelRef,
    handleChangeCollapse,
    getCurrentCode,
    getSelectedLanguageObject,
  } = useEditor(languagesOfProblem);

  // Initialize testcases hooks
  const { testcases, handleSubmission, isPending, numberOfPassedTestcases } =
    useTestcases({
      publicTestcases,
      problemId: problem.problemId,
      getCurrentCode,
      getSelectedLanguageObject,
    });

  // Handle submit code - can be extended for actual submission
  const { setIsShowSubmitTab, setSubmissionId } = useProblemEditorContext();
  const { mutateAsync: submitCodeAsync } =
    trpc.submissions.runCode.iterable.useMutation();
  const utils = trpc.useUtils();
  const handleSubmitCode = () => {
    // Implement submission logic or integration with your API
    const payload: RunCodeInput = {
      code: getCurrentCode(),
      isTest: false,
      languageId: getSelectedLanguageObject()!.languageId!,
      problemId: problem.problemId,
      userId: "1",
    };
    submitCodeAsync(payload).then(async (asyncGen) => {
      setIsShowSubmitTab(true);
      for await (const result of asyncGen) {
        setSubmissionId(result.submissionId);
        utils.submissions.getSubmissionById.invalidate(result.submissionId);
      }
    });
  };

  return (
    <ResizablePanel defaultSize={50} minSize={45}>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={93} minSize={50} ref={codePanelRef}>
          {/* Editor Toolbar */}
          <EditorToolbar
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            languagesOfProblem={languagesOfProblem}
            onRunCode={handleSubmission}
            onSubmitCode={handleSubmitCode}
            isPending={isPending}
          />

          {/* Code Editor */}
          <CodeEditorPanel language={selectedLanguage} />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={7} minSize={7} maxSize={50}>
          <div className="flex items-center justify-center">
            {/* Test Results Panel */}
            <TestResultPanel
              isOpen={isTestResultOpen}
              onOpenChange={handleChangeCollapse}
              testcases={testcases}
              numberOfPassedTestcases={numberOfPassedTestcases}
              totalTestcases={publicTestcases.length}
              isPending={isPending}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );
}
