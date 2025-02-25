"use client";
import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  LuCheck as Check,
  LuX as X,
  LuClock as Clock,
  LuActivity as Activity,
  LuCpu as Cpu,
  LuMemoryStick as Memory,
  LuWatch as Stopwatch,
  LuList as List,
  LuRefreshCw as Refresh,
  LuDownload as Download,
  LuCode as Code,
  LuChartBar as BarChart,
  LuTriangleAlert,
} from "react-icons/lu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/_components/ui/accordion";
import dayjs from "dayjs";
import { useProblemEditorContext } from "../context";
import { trpc } from "@/trpc/react";
import {
  SubmissionStatus,
  SubmissionTestcaseStatus,
} from "@/server/schema/enum";
import {
  SubmissionBrief,
  type SubmissionById,
} from "@/server/service/submission.service";

// Component for status badges
const StatusBadge = ({ status }: { status: SubmissionStatus }) => {
  type StatusConfig = {
    icon: JSX.Element;
    text: string;
    className: string;
  };
  type StatusConfigMap = {
    [key in SubmissionStatus | "default"]: StatusConfig;
  };
  const statusConfig: StatusConfigMap = {
    [SubmissionStatus.ACCEPTED]: {
      icon: <Check className="h-4 w-4" />,
      text: "Chấp nhận",
      className: "bg-green-100 text-green-700",
    },
    [SubmissionStatus.WRONG_ANSWER]: {
      icon: <X className="h-4 w-4" />,
      text: "Kết quả sai",
      className: "bg-red-100 text-red-700",
    },
    [SubmissionStatus.TIME_LIMIT_EXCEEDED]: {
      icon: <Stopwatch className="h-4 w-4" />,
      text: "Vượt quá thời gian",
      className: "bg-orange-100 text-orange-700",
    },
    [SubmissionStatus.MEMORY_LIMIT_EXCEEDED]: {
      icon: <Memory className="h-4 w-4" />,
      text: "Vượt quá bộ nhớ",
      className: "bg-purple-100 text-purple-700",
    },
    [SubmissionStatus.PENDING]: {
      icon: <Activity className="h-4 w-4 animate-pulse" />,
      text: "Đang chạy",
      className: "bg-blue-100 text-blue-700",
    },
    [SubmissionStatus.COMPILE_ERROR]: {
      icon: <X className="h-4 w-4" />,
      text: "Lỗi biên dịch",
      className: "bg-red-100 text-red-700",
    },
    [SubmissionStatus.RUNTIME_ERROR]: {
      icon: <X className="h-4 w-4" />,
      text: "Lỗi thời gian chạy",
      className: "bg-red-100 text-red-700",
    },
    [SubmissionStatus.DRAFT]: {
      icon: <Clock className="h-4 w-4" />,
      text: "Nháp",
      className: "bg-gray-100 text-gray-700",
    },
    default: {
      icon: <Clock className="h-4 w-4" />,
      text: "Đang xử lý",
      className: "bg-gray-100 text-gray-700",
    },
  };

  const { icon, text, className } =
    statusConfig[status] || statusConfig.default;

  return (
    <div
      className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${className}`}
    >
      {icon}
      {text}
    </div>
  );
};

// Component for test case icons

// Header section component
const SubmissionHeader = ({
  submission,
  isAutoRefresh,
  setIsAutoRefresh,
}: {
  submission: SubmissionById;
  isAutoRefresh: boolean;
  setIsAutoRefresh: (value: boolean) => void;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div>
      <h2 className="text-lg font-semibold text-gray-900">
        Bài nộp #{submission.submissionId}
      </h2>
      <p className="text-sm text-gray-500">
        <span className="font-medium text-gray-700">Bài tập:</span> Two Sum (
        {submission.problemId})
      </p>
    </div>
    <div className="flex items-center gap-2">
      <StatusBadge status={submission.status as SubmissionStatus} />
      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        onClick={() => setIsAutoRefresh(!isAutoRefresh)}
      >
        <Refresh
          className={`h-4 w-4 ${
            isAutoRefresh && submission.status === SubmissionStatus.PENDING
              ? "animate-spin"
              : ""
          }`}
        />
        {isAutoRefresh ? "Dừng auto-refresh" : "Auto-refresh"}
      </Button>
    </div>
  </div>
);

// Progress bar component
const SubmissionProgress = ({ submission }: { submission: SubmissionById }) => {
  if (submission!.status !== SubmissionStatus.PENDING) return null;

  const progress = Math.floor(
    (submission!.testcases.filter(
      (tc) => tc.status !== SubmissionTestcaseStatus.RUNNING,
    ).length /
      submission!.testcases.length) *
      100,
  );

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Tiến trình chạy</span>
        <span className="font-medium text-gray-700">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

// Overview tab content
const OverviewTab = ({
  submission,
  briefSubmission,
}: {
  submission: SubmissionById;
  briefSubmission: SubmissionBrief;
}) => {
  const totalTestCases = submission!.testcases.length;
  const passedTestCases = submission!.testcases.filter(
    (tc) => tc.status === SubmissionTestcaseStatus.Success,
  ).length;

  return (
    <div className="space-y-4">
      {/* Submission details and performance grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SubmissionInfoCard
          submission={submission}
          briefSubmission={briefSubmission}
        />
        <PerformanceCard
          submission={submission}
          passedTestCases={passedTestCases}
          totalTestCases={totalTestCases}
        />
      </div>

      {/* Success visualization for accepted submissions */}
      {submission!.status === SubmissionStatus.ACCEPTED && (
        <SuccessVisualization submission={submission} />
      )}

      {/* Test cases summary */}
      <TestCasesSummary testcases={submission!.testcases!} />
    </div>
  );
};
type TestcaseList = SubmissionById["testcases"];
// Submission info card component
const SubmissionInfoCard = ({
  submission,
  briefSubmission,
}: {
  submission: SubmissionById;
  briefSubmission: SubmissionBrief;
}) => (
  <div className="rounded-lg border border-gray-200 p-4">
    <h3 className="mb-3 text-sm font-medium text-gray-700">
      Thông tin bài nộp
    </h3>
    <ul className="space-y-3">
      <li className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Ngôn ngữ</span>
        <span className="font-medium text-gray-900">
          {submission!.languageId}
        </span>
      </li>
      <li className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Thời gian nộp</span>
        <span className="font-medium text-gray-900">
          {dayjs(briefSubmission?.createdAt).format("DD/MM/YYYY HH:mm")}
        </span>
      </li>
      <li className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Trạng thái</span>
        <StatusBadge status={submission!.status as SubmissionStatus} />
      </li>
    </ul>
  </div>
);

// Performance card component
const PerformanceCard = ({
  submission,
  passedTestCases,
  totalTestCases,
}: {
  submission: SubmissionById;
  passedTestCases: number;
  totalTestCases: number;
}) => (
  <div className="rounded-lg border border-gray-200 p-4">
    <h3 className="mb-3 text-sm font-medium text-gray-700">Hiệu suất</h3>
    <ul className="space-y-3">
      <li className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <Cpu className="h-4 w-4" />
          Thời gian chạy
        </span>
        <span className="font-medium text-gray-900">
          {submission!.timeExecutionInMs}
        </span>
      </li>
      <li className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <Memory className="h-4 w-4" />
          Bộ nhớ sử dụng
        </span>
        <span className="font-medium text-gray-900">
          {submission!.memoryUsageInKb}
        </span>
      </li>
      <li className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <Check className="h-4 w-4" />
          Test cases đạt
        </span>
        <span className="font-medium text-gray-900">
          {passedTestCases}/{totalTestCases}
        </span>
      </li>
    </ul>
  </div>
);

// Success visualization component for accepted submissions
const SuccessVisualization = ({
  submission,
}: {
  submission: SubmissionById;
}) => (
  <div className="rounded-lg border border-green-100 bg-green-50 p-4">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-sm font-medium text-green-800">Kết quả bài nộp</h3>
      <span className="font-medium text-green-800">Nộp thành công!</span>
    </div>

    <div className="flex items-center gap-3">
      <ResourceUsageBar
        label="Thời gian"
        value={submission!.timeExecutionInMs}
        min="0 ms"
        max="Giới hạn: 200 ms"
        percentage={30}
      />
      <ResourceUsageBar
        label="Bộ nhớ"
        value={submission!.memoryUsageInKb}
        min="0 MB"
        max="Giới hạn: 32 MB"
        percentage={45}
      />
    </div>
  </div>
);

// Resource usage bar component
const ResourceUsageBar = ({
  label,
  value,
  min,
  max,
  percentage,
}: {
  label: string;
  value: number;
  min: string;
  max: string;
  percentage: number;
}) => (
  <div className="flex-1 space-y-2">
    <div className="flex items-center justify-between text-sm">
      <span className="text-green-700">{label}</span>
      <span className="font-medium text-green-900">{value}</span>
    </div>
    <div className="h-2 rounded-full bg-green-200">
      <div
        className="h-2 rounded-full bg-green-500"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
    <div className="flex justify-between text-xs text-green-700">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </div>
);

// Test cases summary component
const TestCasesSummary = ({ testcases }: { testcases: TestcaseList }) => (
  <div>
    <h3 className="mb-3 text-sm font-medium text-gray-700">
      Tóm tắt Test Cases
    </h3>
    <div className="grid grid-cols-5 gap-2">
      {testcases.map((testcase) => (
        <TestCaseSummaryItem key={testcase.testcaseId} testcase={testcase} />
      ))}
    </div>
  </div>
);

type TestCase = SubmissionById["testcases"][0];
// Test case summary item component
const TestCaseSummaryItem = ({ testcase }: { testcase: TestCase }) => {
  const getBackgroundColor = (status: SubmissionTestcaseStatus) => {
    switch (status) {
      case SubmissionTestcaseStatus.Success:
        return "bg-green-100";
      case SubmissionTestcaseStatus.RUNNING:
        return "bg-blue-100";
      case SubmissionTestcaseStatus.NONE:
        return "bg-gray-100";
      default:
        return "bg-red-100";
    }
  };

  return (
    <div
      className={`flex h-12 items-center justify-center rounded-lg ${getBackgroundColor(testcase.status as SubmissionTestcaseStatus)}`}
    >
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-600">
          #{testcase.testcase.label || testcase.testcaseId}
        </span>
        <TestCaseIcon status={testcase.status as SubmissionTestcaseStatus} />
      </div>
    </div>
  );
};

// Test cases tab content
const TestCasesTab = ({ submission }: { submission: SubmissionById }) => {
  const passedTestCases = submission!.testcases.filter(
    (tc) => tc.status === SubmissionTestcaseStatus.Success,
  ).length;
  const totalTestCases = submission!.testcases.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          Chi tiết Test Cases
        </h3>
        <span className="text-sm text-gray-500">
          Đã đạt: {passedTestCases}/{totalTestCases}
        </span>
      </div>

      <div className="space-y-4">
        {submission!.testcases.map((testcase) => (
          <TestCaseDetail key={testcase.testcaseId} testcase={testcase} />
        ))}
      </div>
    </div>
  );
};

// Test case detail component
const TestCaseDetail = ({ testcase }: { testcase: TestCase }) => {
  const getStatusColors = (status: SubmissionTestcaseStatus) => {
    switch (status) {
      case SubmissionTestcaseStatus.Success:
        return {
          border: "border-green-200",
          background: "bg-green-50",
          hoverBg: "hover:bg-green-100",
          text: "text-green-700",
        };
      case SubmissionTestcaseStatus.RUNNING:
        return {
          border: "border-blue-200",
          background: "bg-blue-50",
          hoverBg: "hover:bg-blue-100",
          text: "text-blue-700",
        };
      case SubmissionTestcaseStatus.NONE:
        return {
          border: "border-gray-200",
          background: "bg-gray-50",
          hoverBg: "hover:bg-gray-100",
          text: "text-gray-700",
        };
      case SubmissionTestcaseStatus.CompileError:
        return {
          border: "border-red-200",
          background: "bg-red-50",
          hoverBg: "hover:bg-red-100",
          text: "text-red-700",
        };
      case SubmissionTestcaseStatus.RuntimeError:
        return {
          border: "border-orange-200",
          background: "bg-orange-50",
          hoverBg: "hover:bg-orange-100",
          text: "text-orange-700",
        };
      case SubmissionTestcaseStatus.WrongAnswer:
        return {
          border: "border-red-200",
          background: "bg-red-50",
          hoverBg: "hover:bg-red-100",
          text: "text-red-700",
        };
      case SubmissionTestcaseStatus.TimeLimitExceeded:
        return {
          border: "border-yellow-200",
          background: "bg-yellow-50",
          hoverBg: "hover:bg-yellow-100",
          text: "text-yellow-800",
        };
      case SubmissionTestcaseStatus.MemoryLimitExceeded:
        return {
          border: "border-purple-200",
          background: "bg-purple-50",
          hoverBg: "hover:bg-purple-100",
          text: "text-purple-700",
        };
      default:
        return {
          border: "border-red-200",
          background: "bg-red-50",
          hoverBg: "hover:bg-red-100",
          text: "text-red-700",
        };
    }
  };

  const { border, background, hoverBg, text } = getStatusColors(
    testcase.status as SubmissionTestcaseStatus,
  );

  return (
    <div className={`mb-4 overflow-hidden rounded-lg border ${border}`}>
      {testcase.testcase.isSample ? (
        <TestCaseSampleDetail
          testcase={testcase}
          colorClasses={{ background, hoverBg, text }}
        />
      ) : (
        <TestCaseHiddenDetail
          testcase={testcase}
          colorClasses={{ background, text }}
        />
      )}
    </div>
  );
};
const TestCaseIcon = ({ status }: { status: SubmissionTestcaseStatus }) => {
  switch (status) {
    case SubmissionTestcaseStatus.Success:
      return <Check className="h-5 w-5 text-green-500" />;
    case SubmissionTestcaseStatus.RUNNING:
      return <Refresh className="h-5 w-5 animate-spin text-blue-500" />;
    case SubmissionTestcaseStatus.NONE:
      return <Clock className="h-5 w-5 text-gray-400" />;
    case SubmissionTestcaseStatus.CompileError:
      return <X className="h-5 w-5 text-red-500" />;
    case SubmissionTestcaseStatus.RuntimeError:
      return <LuTriangleAlert className="h-5 w-5 text-orange-500" />;
    case SubmissionTestcaseStatus.WrongAnswer:
      return <X className="h-5 w-5 text-red-500" />;
    case SubmissionTestcaseStatus.TimeLimitExceeded:
      return <Clock className="h-5 w-5 text-yellow-600" />;
    case SubmissionTestcaseStatus.MemoryLimitExceeded:
      return <Memory className="h-5 w-5 text-purple-500" />;
    default:
      return <X className="h-5 w-5 text-red-500" />;
  }
};
// Sample test case detail component
const TestCaseSampleDetail = ({
  testcase,
  colorClasses,
}: {
  testcase: TestCase;
  colorClasses: any;
}) => {
  const { background, hoverBg, text } = colorClasses;

  // Map status enum to display text
  const getStatusDisplayText = (status: SubmissionTestcaseStatus) => {
    switch (status) {
      case SubmissionTestcaseStatus.Success:
        return "Thành công";
      case SubmissionTestcaseStatus.CompileError:
        return "Lỗi biên dịch";
      case SubmissionTestcaseStatus.RuntimeError:
        return "Lỗi runtime";
      case SubmissionTestcaseStatus.WrongAnswer:
        return "Kết quả sai";
      case SubmissionTestcaseStatus.TimeLimitExceeded:
        return "TLE";
      case SubmissionTestcaseStatus.MemoryLimitExceeded:
        return "MLE";
      case SubmissionTestcaseStatus.RUNNING:
        return "Đang chạy";
      case SubmissionTestcaseStatus.NONE:
        return "Chờ";
      default:
        return "Unknown";
    }
  };
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value={`testcase-${testcase.testcaseId}`}
        className="border-0"
      >
        <AccordionTrigger
          className={`flex w-full items-center justify-between px-3 py-2 ${background} ${hoverBg} !no-underline`}
        >
          <div className="flex items-center gap-2">
            <TestCaseIcon
              status={testcase.status as SubmissionTestcaseStatus}
            />
            <div className="flex flex-col">
              <span className={`font-medium ${text}`}>
                Test Case #{testcase.testcase.label || "unlabeled"}
                <span className="ml-2 rounded bg-green-200 px-1.5 py-0.5 text-xs text-green-800">
                  Public
                </span>
              </span>
              <span className={`text-sm ${text}`}>
                {getStatusDisplayText(
                  testcase.status as SubmissionTestcaseStatus,
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-gray-600">
              <Cpu className="h-3.5 w-3.5" />
              {testcase.runtimeInMs}
            </span>
            <span className="flex items-center gap-1 text-gray-600">
              <Memory className="h-3.5 w-3.5" />
              {testcase.memoryUsedInKb}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 pt-3">
          <TestCaseDetailContent testcase={testcase} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

// Test case detail content component
const TestCaseDetailContent = ({ testcase }: { testcase: TestCase }) => {
  const getOutputBackgroundColor = (status: SubmissionTestcaseStatus) => {
    switch (status) {
      case SubmissionTestcaseStatus.Success:
        return "bg-green-50 text-green-800";
      case SubmissionTestcaseStatus.RUNNING:
        return "bg-blue-50 text-blue-800";
      case SubmissionTestcaseStatus.NONE:
        return "bg-gray-50 text-gray-800";
      case SubmissionTestcaseStatus.CompileError:
        return "bg-red-50 text-red-800";
      case SubmissionTestcaseStatus.RuntimeError:
        return "bg-orange-50 text-orange-800";
      case SubmissionTestcaseStatus.WrongAnswer:
        return "bg-red-50 text-red-800";
      case SubmissionTestcaseStatus.TimeLimitExceeded:
        return "bg-yellow-50 text-yellow-800";
      case SubmissionTestcaseStatus.MemoryLimitExceeded:
        return "bg-purple-50 text-purple-800";
      default:
        return "bg-red-50 text-red-800";
    }
  };

  return (
    <>
      <div className="mb-3">
        <div className="mb-1 text-sm font-medium text-gray-700">Input:</div>
        <pre className="rounded bg-gray-50 p-2 text-sm text-gray-800">
          {testcase.testcase.label}
        </pre>
      </div>
      <div className="mb-3">
        <div className="mb-1 text-sm font-medium text-gray-700">
          Kết quả mong đợi:
        </div>
        <pre className="rounded bg-gray-50 p-2 text-sm text-gray-800">
          {testcase.testcase.label}
        </pre>
      </div>
      <div className="mb-3">
        <div className="mb-1 text-sm font-medium text-gray-700">Output:</div>
        <pre
          className={`rounded p-2 text-sm ${getOutputBackgroundColor(testcase.status as SubmissionTestcaseStatus)}`}
        >
          {testcase.testcase.label || "(đang chờ)"}
        </pre>
      </div>
    </>
  );
};

// Hidden test case detail component
// Hidden test case detail component
const TestCaseHiddenDetail = ({
  testcase,
  colorClasses,
}: {
  testcase: TestCase;
  colorClasses: any;
}) => {
  const { background, text } = colorClasses;

  // Map status enum to display text
  const getStatusDisplayText = (status: SubmissionTestcaseStatus) => {
    switch (status) {
      case SubmissionTestcaseStatus.Success:
        return "Thành công";
      case SubmissionTestcaseStatus.CompileError:
        return "Lỗi biên dịch";
      case SubmissionTestcaseStatus.RuntimeError:
        return "Lỗi runtime";
      case SubmissionTestcaseStatus.WrongAnswer:
        return "Kết quả sai";
      case SubmissionTestcaseStatus.TimeLimitExceeded:
        return "TLE";
      case SubmissionTestcaseStatus.MemoryLimitExceeded:
        return "MLE";
      case SubmissionTestcaseStatus.RUNNING:
        return "Đang chạy";
      case SubmissionTestcaseStatus.NONE:
        return "Chờ";
      default:
        return "Unknown";
    }
  };

  return (
    <div className={`flex items-center justify-between p-3 ${background}`}>
      <div className="flex items-center gap-2">
        <TestCaseIcon status={testcase.status as SubmissionTestcaseStatus} />
        <div className="flex flex-col">
          <span className={`font-medium ${text}`}>
            Test Case #{testcase.testcaseId}
            <span className="ml-2 rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600">
              Hidden
            </span>
          </span>
          <span className={`text-sm ${text}`}>
            {getStatusDisplayText(testcase.status as SubmissionTestcaseStatus)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1 text-gray-600">
          <Cpu className="h-3.5 w-3.5" />
          {testcase.runtimeInMs}
        </span>
        <span className="flex items-center gap-1 text-gray-600">
          <Memory className="h-3.5 w-3.5" />
          {testcase.memoryUsedInKb}
        </span>
      </div>
    </div>
  );
};

// Code tab content
const CodeTab = ({
  submission,
  briefSubmission,
}: {
  submission: SubmissionById;
  briefSubmission: SubmissionBrief;
}) => (
  <div>
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-700">
        Mã nguồn ({briefSubmission?.language.languageName}{" "}
        {briefSubmission?.language.version})
      </h3>
      <Button variant="outline" size="sm" className="gap-1">
        <Download className="h-4 w-4" />
        Tải xuống
      </Button>
    </div>

    <div className="overflow-hidden rounded-lg border border-gray-200">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
        <code className="text-sm text-gray-600">
          submission_{submission!.submissionId}
          {briefSubmission?.language.sourceFileExt}
        </code>
      </div>
      <pre className="max-h-72 overflow-y-auto bg-gray-900 p-4 text-sm text-white">
        <code>{briefSubmission?.code}</code>
      </pre>
    </div>
  </div>
);

// Action buttons component
const ActionButtons = ({ submission }: { submission: SubmissionById }) => (
  <div className="flex flex-wrap justify-end gap-2 border-t border-gray-200 pt-4">
    <Button variant="outline" size="sm">
      Quay lại bài tập
    </Button>
    <Button variant="outline" size="sm">
      Nộp lại
    </Button>
    {submission!.status === SubmissionStatus.ACCEPTED && (
      <Button size="sm">Tiếp tục</Button>
    )}
  </div>
);

// Main component
const SubmissionProgressTab = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const { isShowSubmitTab, submissionId } = useProblemEditorContext();

  const { data: submission } = trpc.submissions.getSubmissionById.useQuery(
    submissionId,
    {
      enabled: isShowSubmitTab && !!submissionId,
    },
  );

  const { data: briefSubmission } =
    trpc.submissions.getBriefSubmissionById.useQuery(submissionId, {
      enabled: isShowSubmitTab && !!submissionId,
    });

  if (
    !submission ||
    !briefSubmission ||
    submission.status === SubmissionStatus.DRAFT
  )
    return null;

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      {/* Header section */}
      <SubmissionHeader
        submission={submission}
        isAutoRefresh={isAutoRefresh}
        setIsAutoRefresh={setIsAutoRefresh}
      />

      {/* Progress bar */}
      <SubmissionProgress submission={submission} />

      {/* Tabs */}
      <Tabs
        defaultValue="overview"
        className="w-full"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="testcases" className="flex items-center gap-1">
            <List className="h-4 w-4" />
            Test Cases
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            Mã nguồn
          </TabsTrigger>
        </TabsList>

        {/* Tab content */}
        <TabsContent value="overview" className="mt-4">
          <OverviewTab
            submission={submission}
            briefSubmission={briefSubmission!}
          />
        </TabsContent>

        <TabsContent value="testcases" className="mt-4">
          <TestCasesTab submission={submission} />
        </TabsContent>

        <TabsContent value="code" className="mt-4">
          <CodeTab submission={submission} briefSubmission={briefSubmission!} />
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <ActionButtons submission={submission} />
    </div>
  );
};

export default SubmissionProgressTab;
