// hooks/useTestcases.ts
import { useState, useMemo, useCallback } from "react";
import { TestCase } from "@/server/schema/testcase.schema";
import { SubmissionTestcaseStatus } from "@/server/schema/enum";
import { toast } from "sonner";
import { trpc } from "@/trpc/react";
import { TestCaseWithStatus, LanguageOfProblem } from "../types";

interface UseTestcasesProps {
  publicTestcases: TestCase[];
  problemId: string;
  getCurrentCode: () => string;
  getSelectedLanguageObject: () => LanguageOfProblem | undefined;
}

export function useTestcases({
  publicTestcases,
  problemId,
  getCurrentCode,
  getSelectedLanguageObject,
}: UseTestcasesProps) {
  const [testcases, setTestcases] = useState<TestCaseWithStatus[]>(
    publicTestcases.map((testcase) => ({
      ...testcase,
      status: SubmissionTestcaseStatus.NONE,
    })),
  );

  const { mutateAsync: runCodeAsync, isPending } =
    trpc.submissions.runCode.iterable.useMutation();

  const handleSubmission = useCallback(async () => {
    // Set all testcases to running state
    setTestcases((testcases) =>
      testcases.map((testcase) => ({
        ...testcase,
        status: SubmissionTestcaseStatus.RUNNING,
      })),
    );

    // Get selected language
    const runningLang = getSelectedLanguageObject();
    if (!runningLang) {
      toast.error("Vui lòng chọn ngôn ngữ lập trình");
      return;
    }

    // Get current code
    const code = getCurrentCode();
    if (!code || code.trim() === "" || code === runningLang.templateCode) {
      toast.error("Vui lòng nhập code");
      return;
    }

    // Run code and update testcases
    try {
      const asynGen = await runCodeAsync({
        code: code,
        problemId: problemId,
        userId: "1",
        languageId: Number(runningLang.languageId) || 1,
        isTest: true,
      });

      for await (const result of asynGen) {
        setTestcases((testcases) =>
          testcases.map((testcase) => {
            if (testcase.testCaseId === result.testCaseId) {
              return {
                ...testcase,
                status: result.status as SubmissionTestcaseStatus,
                actualOutput: result.stdout,
              };
            }
            return testcase;
          }),
        );
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi chạy code");
      console.error(error);
    }
  }, [getCurrentCode, getSelectedLanguageObject, problemId, runCodeAsync]);

  const numberOfPassedTestcases = useMemo(
    () =>
      testcases.filter(
        (testcase) => testcase.status === SubmissionTestcaseStatus.Success,
      ).length,
    [testcases],
  );

  return {
    testcases,
    setTestcases,
    handleSubmission,
    isPending,
    numberOfPassedTestcases,
  };
}
