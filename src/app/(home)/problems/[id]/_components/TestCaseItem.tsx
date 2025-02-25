// components/TestCaseItem.tsx
import { CodeDisplay } from "@/app/_components/code-display";
import {
  SubmissionTestcaseStatusDisplay,
  getStatusConfig,
  getIsError,
} from "../utils";
import { TestCaseWithStatus } from "../types";

interface TestCaseItemProps {
  testcase: TestCaseWithStatus;
  index: number;
}

export function TestCaseItem({ testcase, index }: TestCaseItemProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium">Testcase {index + 1}</span>
        <span
          className={`rounded-full px-2 py-1 text-sm ${
            getStatusConfig(testcase.status).badge
          }`}
        >
          {SubmissionTestcaseStatusDisplay[testcase.status]}
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
          <CodeDisplay
            isError={getIsError(testcase.status)}
            content={testcase.actualOutput || ""}
          />
        </div>
      </div>
    </div>
  );
}
