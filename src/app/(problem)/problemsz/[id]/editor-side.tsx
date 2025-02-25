"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Editor from "@monaco-editor/react";
import { LuPlay, LuSave, LuSend, LuTimer as Timer } from "react-icons/lu";
import React, { useState } from "react";
import { type LanguageOfProblem } from "@/server/service/problem.service";
import { loader } from "@monaco-editor/react";
import { useIsClient } from "usehooks-ts";
import TestcaseRunner from "./testcase";
import { trpc } from "@/trpc/react";
import { type TestCase } from "@/server/schema/testcase.schema";
import {
  SubmissionStatus,
  SubmissionTestcaseStatus,
} from "@/server/schema/enum";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useProblemEditorContext } from "../../../(home)/problems/[id]/context";
interface Props {
  languages: LanguageOfProblem[];
  problemId: string;
}
type BriefTestcase = Omit<TestCase, "createdAt" | "updatedAt"> & {
  status: SubmissionTestcaseStatus;
  actualOutput: string;
};

export default function EditorSide({ languages, problemId }: Props) {
  const { data: session, status } = useSession();

  const [language, setLanguage] = useState(
    languages?.[0]?.monacoCodeLanguage || "plaintext",
  );
  const isClient = useIsClient();
  React.useEffect(() => {
    if (isClient) {
      loader.init().then((monaco) => {
        console.log("Monaco initialized");
        console.log(monaco);
      });
    }
  }, [isClient]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = React.useRef<any>(null);
  React.useEffect(() => {
    languages.forEach((lang) => {
      if (lang.monacoCodeLanguage === language) {
        if (editorRef.current?.setValue)
          editorRef.current?.setValue(lang.templateCode);
      }
    });
  }, [language, editorRef, languages]);
  const { mutateAsync } = trpc.submissions.runCode.iterable.useMutation();
  const { mutateAsync: saveDraft, isPending: isSaveDraftPending } =
    trpc.submissions.saveDraft.useMutation();

  const { data: latestDraft } = trpc.submissions.getLatestDraft.useQuery(
    {
      problemId,
      languageId: languages.find(
        (lang) => lang.monacoCodeLanguage === language,
      )!.languageId!,
    },
    {
      enabled:
        !!session?.user.id && !!languages.length && !!problemId && !!language,
    },
  );
  React.useEffect(() => {
    console.log("latestDraft", latestDraft);
    if (latestDraft && editorRef.current && latestDraft.code) {
      editorRef.current.setValue(latestDraft.code);
    }
  }, [latestDraft, editorRef]);

  const handleSaveDraft = React.useCallback(() => {
    saveDraft({
      code: editorRef.current.getValue(),
      problemId,
      userId: "1",
      languageId: languages.find(
        (lang) => lang.monacoCodeLanguage === language,
      )!.languageId!,
      isTest: false,
    })
      .then((submissionId) => {
        console.log("Save draft success", submissionId);
        toast.success("Lưu nháp thành công");
      })
      .catch((error) => {
        toast.error("Lưu nháp thất bại");
      });
  }, [editorRef, language, languages, problemId, saveDraft]);

  const { data } = trpc.testcases.getPublicTestcases.useQuery({
    problemId,
  });
  const [testcases, setTestcases] = useState<BriefTestcase[]>([]);
  React.useEffect(() => {
    if (data?.length) {
      setTestcases(
        data.map((testcase) => ({
          ...testcase,
          status: SubmissionTestcaseStatus.NONE,
          actualOutput: "",
        })),
      );
    }
  }, [data?.length]);
  const handleSubmission = React.useCallback(() => {
    setTestcases((testcases) =>
      testcases.map((testcase) => ({
        ...testcase,
        status: SubmissionTestcaseStatus.RUNNING,
      })),
    );
    mutateAsync({
      code: editorRef.current.getValue(),
      problemId: problemId,
      userId: "1",
      languageId: languages.find(
        (lang) => lang.monacoCodeLanguage === language,
      )!.languageId!,
      isTest: true,
    }).then(async (asynGen) => {
      for await (const i of asynGen) {
        console.log("runCode", i);
        setTestcases((testcases) =>
          testcases.map((testcase) => {
            if (testcase.testCaseId == i.testCaseId) {
              return {
                ...testcase,
                status: i.status as SubmissionTestcaseStatus,
                actualOutput: i.stdout,
              };
            }
            return testcase;
          }),
        );
      }
    });
  }, [editorRef, language, languages, mutateAsync, problemId]);

  return (
    <div className="flex w-1/2 flex-col p-1">
      {/* Editor controls */}
      <div className="mb-2 flex items-center justify-between">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Ngôn ngữ" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem
                key={lang.languageId}
                value={lang?.monacoCodeLanguage || "plaintext"}
              >
                {`${lang.name} (${lang.version})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-gray-600">
            <Timer className="h-4 w-4" />
            25:00
          </span>
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="mt-1 w-full"
                onClick={handleSubmission}
              >
                <LuPlay className="h-4 w-4" />
                Chạy test
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-2xl">
                <DrawerHeader>
                  <DrawerTitle>Test Cases</DrawerTitle>
                  <DrawerDescription>
                    Kiểm tra code với các test cases
                  </DrawerDescription>
                </DrawerHeader>
                <div className="max-h-[80vh] overflow-y-auto p-4">
                  <div className="space-y-3">
                    {testcases?.map((test, index) => (
                      <TestcaseRunner
                        key={index}
                        actualOutput={test.actualOutput}
                        status={test.status}
                        testcase={test as never}
                      />
                    ))}
                  </div>
                  {/* todo: show result */}
                  {/* <div className="mt-4 p-4 bg-gray-100 rounded-md font-mono text-sm">
										<div className="text-green-600">
											[Success] All test cases passed!
										</div>
										<div className="text-gray-600">
											Runtime: 76 ms
										</div>
										<div className="text-gray-600">
											Memory: 42.1 MB
										</div>
									</div> */}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
          <Button
            variant="outline"
            className="mt-1 w-full"
            disabled={isSaveDraftPending}
            onClick={handleSaveDraft}
          >
            <LuSave className="h-4 w-4" />
            Lưu nháp
          </Button>
          <SubmittingButton
            problemId={problemId}
            getCode={() => editorRef.current.getValue()}
            getLanguageId={() =>
              languages.find((lang) => lang.monacoCodeLanguage === language)
                ?.languageId || 0
            }
          />
        </div>
      </div>

      {/* Code editor */}
      <div className="flex-1 overflow-hidden" id="monaco-editor">
        <Editor
          height="100%"
          theme="vs-dark"
          language={language.toLowerCase()}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
          }}
        />
      </div>
    </div>
  );
}

interface ISubmittingButtonProps {
  getCode: () => string;
  getLanguageId: () => number;
  problemId: string;
}

function SubmittingButton({
  problemId,
  getCode,
  getLanguageId,
}: ISubmittingButtonProps) {
  const {
    setIsShowSubmitTab,
    setSubmissionStatus,
    setTabValue,
    setTestcases,
    setSubmissionId,
  } = useProblemEditorContext();
  const { mutateAsync, isPending } =
    trpc.submissions.runCode.iterable.useMutation();
  const handleSubmission = () => {
    setTestcases((testcases) =>
      testcases.map((testcase) => ({
        ...testcase,
        status: SubmissionTestcaseStatus.RUNNING,
      })),
    );
    setIsShowSubmitTab(true);
    setTabValue("submit");
    setSubmissionStatus(SubmissionStatus.PENDING);
    mutateAsync({
      code: getCode(),
      problemId: problemId,
      userId: "1",
      languageId: getLanguageId(),
      isTest: false,
    }).then(async (asynGen) => {
      let submissionId = "";
      for await (const i of asynGen) {
        console.log("runCode", i);
        if (!submissionId) {
          submissionId = i.submissionId;
        }
        setTestcases((testcases) =>
          testcases.map((testcase) => {
            if (testcase.testCaseId == i.testCaseId) {
              return {
                ...testcase,
                status: i.status as SubmissionTestcaseStatus,
                actualOutput: i.stdout,
              };
            }
            return testcase;
          }),
        );
      }
      setSubmissionId(submissionId);
    });
  };

  return (
    <Button
      className="gap-2 bg-blue-600 hover:bg-blue-700"
      disabled={isPending}
      onClick={handleSubmission}
    >
      <LuSend className="h-4 w-4" />
      {isPending ? "Đang nộp..." : "Nộp bài"}
    </Button>
  );
}
