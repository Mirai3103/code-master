import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { SubmissionTestcaseStatus } from "@/server/schema/enum";
import { type TestCase } from "@/server/schema/testcase.schema";
import { LuCircleCheck, LuCircleX, LuClock, LuLoader } from "react-icons/lu";

interface Props {
  testcase: TestCase;
  status: SubmissionTestcaseStatus;
  actualOutput: string;
}
export default function TestcaseRunner({
  testcase,
  status,
  actualOutput,
}: Props) {
  const statusConfig = getStatusConfig(status);
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={testcase.testCaseId} className="mb-2 border-0">
        <AccordionTrigger className="flex rounded-lg bg-white p-4 shadow-sm hover:no-underline data-[state=open]:rounded-b-none">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              {statusConfig.icon}
              <span className="font-medium">{testcase.label}</span>
            </div>
            <div className="flex items-center gap-4">
              {status !== SubmissionTestcaseStatus.NONE && (
                <Badge
                  variant="secondary"
                  className={`${statusConfig.badge} font-normal`}
                >
                  {status}
                </Badge>
              )}
              <span className="text-sm text-gray-500">
                {testcase.points} points
              </span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="mt-px space-y-4 rounded-b-lg bg-white p-4 shadow-sm">
          <div className="space-y-4">
            <div>
              <div className="mb-2 text-sm text-gray-500">Input</div>
              <pre className="overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-700">
                {testcase.inputData}
              </pre>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <div className="mb-2 text-sm text-gray-500">
                  Expected Output
                </div>
                <pre className="h-full overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-700">
                  {testcase.expectedOutput}
                </pre>
              </div>

              {status !== SubmissionTestcaseStatus.RUNNING &&
                status !== SubmissionTestcaseStatus.NONE && (
                  <div className="flex-1">
                    <div className="mb-2 text-sm text-gray-500">
                      Your Output
                    </div>
                    <pre
                      className={`h-full overflow-x-auto rounded-lg p-3 font-mono text-sm ${
                        status === SubmissionTestcaseStatus.Success
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {actualOutput}
                    </pre>
                  </div>
                )}
            </div>

            {testcase.explanation && (
              <div className="border-t pt-4">
                <div className="mb-2 text-sm text-gray-500">Explanation</div>
                <div className="text-sm">
                  {JSON.stringify(testcase.explanation)}
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
const getStatusConfig = (status: SubmissionTestcaseStatus) => {
  switch (status) {
    case SubmissionTestcaseStatus.Success:
      return {
        badge: "bg-green-100 text-green-800",
        icon: <LuCircleCheck className="h-4 w-4 text-green-600" />,
      };
    case SubmissionTestcaseStatus.RUNNING:
      return {
        badge: "bg-blue-100 text-blue-800",
        icon: <LuLoader className="h-4 w-4 animate-spin text-blue-600" />,
      };
    case SubmissionTestcaseStatus.TimeLimitExceeded:
      return {
        badge: "bg-yellow-100 text-yellow-800",
        icon: <LuClock className="h-4 w-4 text-yellow-600" />,
      };
    case SubmissionTestcaseStatus.NONE:
      return {
        badge: "bg-gray-100 text-gray-800",
        icon: null,
      };
    default:
      return {
        badge: "bg-red-100 text-red-800",
        icon: <LuCircleX className="h-4 w-4 text-red-600" />,
      };
  }
};
