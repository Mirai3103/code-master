"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LuCircleCheck as Check,
  LuCode as Code,
  LuSettings as Settings,
  LuCopy as Copy,
} from "react-icons/lu";
import { RiTestTubeFill as TestTube } from "react-icons/ri";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/_components/ui/collapsible";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/app/_components/ui/resizable";
import { Editor } from "@monaco-editor/react";
import { ImperativePanelHandle } from "react-resizable-panels";

import { Problem } from "@/server/schema/problem.schema";
import { LanguageOfProblem } from "@/server/service/problem.service";
import { TestCase } from "@/server/schema/testcase.schema";
import { CodeDisplay } from "@/app/_components/code-display";
interface Props {
  problem: Problem;
  languagesOfProblem: LanguageOfProblem[];
  publicTestcases: TestCase[];
}
export default function EditorSide({
  problem,
  languagesOfProblem,
  publicTestcases,
}: Props) {
  const [selectedLanguage, setSelectedLanguage] = useState("python3");
  const [isRunning, setIsRunning] = useState(false);
  const [isTestResultOpen, setIsTestResultOpen] = useState(false);
  const codePanelRef = useRef<ImperativePanelHandle>(null);
  const handleChangeCollapse = (isOpen: boolean) => {
    setIsTestResultOpen(isOpen);
    if (codePanelRef.current) {
      if (!isOpen) codePanelRef.current.resize(93);
      else if (codePanelRef.current.getSize() > 71)
        codePanelRef.current.resize(50);
    }
  };
  return (
    <ResizablePanel defaultSize={50} minSize={45}>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={93} minSize={50} ref={codePanelRef}>
          <div className="w-full border-b border-gray-200 bg-white p-1">
            <div className="flex items-center justify-between">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <Code className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languagesOfProblem.map((lang) => (
                    <SelectItem
                      key={lang.languageId}
                      value={lang.monacoCodeLanguage || "plaintext"}
                    >
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={isRunning}
                >
                  <TestTube className="h-4 w-4" />
                  Chạy thử
                </Button>
                <Button className="gap-2">
                  <Check className="h-4 w-4" />
                  Nộp bài
                </Button>
              </div>
            </div>
          </div>
          <div className="h-full w-full flex-1">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              language={selectedLanguage}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
              }}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={7} minSize={7} maxSize={50}>
          <div className="flex items-center justify-center">
            <Collapsible
              className="w-full border-t border-gray-200 bg-white"
              open={isTestResultOpen}
              onOpenChange={handleChangeCollapse}
            >
              <CollapsibleTrigger asChild>
                <div className="flex w-full cursor-pointer items-center justify-between border-b border-gray-200 bg-white p-2 hover:bg-gray-50">
                  <div className="flex w-full items-center gap-2">
                    <h3 className="text-lg font-semibold">Kết quả chạy thử</h3>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                      {publicTestcases.length} testcases
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>2/{publicTestcases.length} passed</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      className="ui-expanded:rotate-180 transform transition-transform"
                    >
                      <path
                        d="M4 6L8 10L12 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="max-h-[300px] overflow-y-auto p-4">
                  <div className="space-y-4">
                    {publicTestcases.map((testcase, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 p-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium">
                            Testcase {index + 1}
                          </span>
                          <span
                            className={`rounded-full px-2 py-1 text-sm ${
                              testcase.inputData === "success"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {testcase.inputData === "success"
                              ? "Đạt"
                              : "Đang chạy"}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Đầu vào:</strong>
                            <CodeDisplay content={testcase.inputData} />
                          </div>
                          <div>
                            <strong>Đầu ra mong muốn:</strong>

                            <CodeDisplay content={testcase.expectedOutput} />
                          </div>
                          <div>
                            <strong>Đầu ra thực tế:</strong>
                            <CodeDisplay content={""} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );
}
