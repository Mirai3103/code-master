"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LuCircleCheck as Check,
  LuThumbsUp as ThumbsUp,
  LuFlag as Flag,
  LuBookmark as Bookmark,
  LuShare2 as Share,
  LuCode as Code,
  LuFileText as FileText,
  LuMessageSquare as Message,
  LuSettings as Settings,
  LuTag as Tag,
  LuCopy as Copy,
  LuZap as Zap,
  LuActivity as Activity,
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

const ProblemSolvingPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("python3");
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const languages = [
    { value: "python3", label: "Python 3" },
    { value: "cpp", label: "C++" },
    { value: "java", label: "Java" },
    { value: "javascript", label: "JavaScript" },
  ];

  const problem = {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    acceptance: "48.2%",
    submissions: "12.5M",
    likes: 45678,
    tags: ["Array", "Hash Table"],
    timeLimit: "1 second",
    memoryLimit: "32 MB",
    description: `Cho một mảng số nguyên nums và một số nguyên target, trả về các chỉ số của hai số trong nums sao cho tổng của chúng bằng target.

Bạn có thể giả định rằng mỗi input sẽ có chính xác một nghiệm, và bạn không thể sử dụng cùng một phần tử hai lần.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation:
          "Vì nums[0] + nums[1] = 2 + 7 = 9, nên chúng ta trả về [0, 1].",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
    ],
    testcases: [
      { input: "[2,7,11,15]\n9", output: "[0,1]", status: "success" },
      { input: "[3,2,4]\n6", output: "[1,2]", status: "success" },
      { input: "[3,3]\n6", output: "[0,1]", status: "pending" },
    ],
  };

  const boilerplateCode = {
    python3: `def twoSum(nums: List[int], target: int) -> List[int]:
    # Code của bạn ở đây
    pass`,
    cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Code của bạn ở đây
}`,
    java: `public int[] twoSum(int[] nums, int target) {
    // Code của bạn ở đây
}`,
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Code của bạn ở đây
};`,
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    setCode(boilerplateCode[value]);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    // Thực hiện chạy code
    setTimeout(() => setIsRunning(false), 1500);
  };
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
    <ResizablePanelGroup
      direction="horizontal"
      className="flex h-screen bg-gray-50"
    >
      <ResizablePanel defaultSize={50} collapsible minSize={30}>
        <div className="h-full overflow-y-auto border-r border-gray-200 bg-white">
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">
                {problem.id}. {problem.title}
              </h1>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                {problem.difficulty}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <ThumbsUp className="h-4 w-4" />
                {problem.likes}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <Activity className="h-4 w-4" />
                {problem.acceptance} chấp nhận
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <Flag className="h-4 w-4" />
                {problem.submissions} nộp bài
              </span>
            </div>
          </div>

          <div className="px-6 py-4">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="description" className="flex-1">
                  <FileText className="mr-2 h-4 w-4" />
                  Mô tả
                </TabsTrigger>
                <TabsTrigger value="hints" className="flex-1">
                  <Zap className="mr-2 h-4 w-4" />
                  Gợi ý
                </TabsTrigger>
                <TabsTrigger value="submissions" className="flex-1">
                  <Activity className="mr-2 h-4 w-4" />
                  Nộp bài
                </TabsTrigger>
                <TabsTrigger value="discussions" className="flex-1">
                  <Message className="mr-2 h-4 w-4" />
                  Thảo luận
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <div className="prose max-w-none">
                  <p>{problem.description}</p>

                  <div className="my-6">
                    <h3 className="text-lg font-semibold">Ví dụ:</h3>
                    {problem.examples.map((example, index) => (
                      <div
                        key={index}
                        className="mt-4 rounded-lg bg-gray-50 p-4"
                      >
                        <div className="mb-2">
                          <strong>Input:</strong> {example.input}
                        </div>
                        <div className="mb-2">
                          <strong>Output:</strong> {example.output}
                        </div>
                        {example.explanation && (
                          <div>
                            <strong>Giải thích:</strong> {example.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="my-6">
                    <h3 className="text-lg font-semibold">Ràng buộc:</h3>
                    <ul className="list-disc pl-6">
                      {problem.constraints.map((constraint, index) => (
                        <li key={index} className="text-gray-700">
                          {constraint}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h3 className="mb-2 text-lg font-semibold">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {problem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hints">
                <Card className="p-4">
                  <h3 className="mb-4 text-lg font-semibold">Gợi ý giải bài</h3>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-yellow-50 p-4">
                      <p className="text-yellow-800">
                        1. Thử nghĩ về cách sử dụng hash table để tối ưu thời
                        gian tìm kiếm
                      </p>
                    </div>
                    <Button variant="outline" className="w-full">
                      Xem thêm gợi ý
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={93} minSize={50} ref={codePanelRef}>
            <div className="w-full border-b border-gray-200 bg-white p-1">
              <div className="flex items-center justify-between">
                <Select
                  value={selectedLanguage}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <Code className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
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
                    onClick={handleRunCode}
                    disabled={isRunning}
                  >
                    <TestTube className="h-4 w-4" />
                    Chạy thử
                  </Button>
                  <Button className="gap-2" disabled={isRunning}>
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
                      <h3 className="text-lg font-semibold">
                        Kết quả chạy thử
                      </h3>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                        {problem.testcases.length} testcases
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>2/3 passed</span>
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
                      {problem.testcases.map((testcase, index) => (
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
                                testcase.status === "success"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {testcase.status === "success"
                                ? "Đạt"
                                : "Đang chạy"}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <strong>Input:</strong>
                              <pre className="mt-1 rounded bg-gray-50 p-2 font-mono">
                                {testcase.input}
                              </pre>
                            </div>
                            <div>
                              <strong>Output:</strong>
                              <pre className="mt-1 rounded bg-gray-50 p-2 font-mono">
                                {testcase.output}
                              </pre>
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
    </ResizablePanelGroup>
  );
};

export default ProblemSolvingPage;
