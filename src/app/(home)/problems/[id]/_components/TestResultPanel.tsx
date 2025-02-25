// components/TestResultPanel.tsx
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/_components/ui/collapsible";
import { TestCaseItem } from "./TestCaseItem";
import { TestCaseWithStatus } from "../types";

interface TestResultPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  testcases: TestCaseWithStatus[];
  numberOfPassedTestcases: number;
  totalTestcases: number;
  isPending: boolean;
}

export function TestResultPanel({
  isOpen,
  onOpenChange,
  testcases,
  numberOfPassedTestcases,
  totalTestcases,
  isPending,
}: TestResultPanelProps) {
  return (
    <Collapsible
      className="w-full border-t border-gray-200 bg-white"
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <CollapsibleTrigger asChild>
        <div className="flex w-full cursor-pointer items-center justify-between border-b border-gray-200 bg-white p-2 hover:bg-gray-50">
          <div className="flex w-full items-center gap-2">
            <h3 className="text-lg font-semibold">Kết quả chạy thử</h3>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
              {totalTestcases} testcases
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {!isPending ? (
              <span>
                {numberOfPassedTestcases}/{totalTestcases} passed
              </span>
            ) : (
              <span>Đang chạy...</span>
            )}
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
            {testcases.map((testcase, index) => (
              <TestCaseItem
                key={testcase.testCaseId}
                testcase={testcase}
                index={index}
              />
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
