import {
  SubmissionStatus,
  SubmissionTestcaseStatus,
} from "@/server/schema/enum";

export const SubmissionStatusDisplay: { [key: string]: string } = {
  [SubmissionStatus.ACCEPTED]: "Chấp nhận",
  [SubmissionStatus.COMPILE_ERROR]: "Lỗi biên dịch",
  [SubmissionStatus.RUNTIME_ERROR]: "Lỗi thời gian chạy",
  [SubmissionStatus.DRAFT]: "Nháp",
  [SubmissionStatus.MEMORY_LIMIT_EXCEEDED]: "Vượt quá giới hạn bộ nhớ",
  [SubmissionStatus.PENDING]: "Đang chờ",
  [SubmissionStatus.WRONG_ANSWER]: "Sai kết quả",
  [SubmissionStatus.TIME_LIMIT_EXCEEDED]: "Vượt quá giới hạn thời gian",
};

export const SubmissionTestcaseStatusDisplay: { [key: string]: string } = {
  [SubmissionTestcaseStatus.CompileError]: "Lỗi biên dịch",
  [SubmissionTestcaseStatus.MemoryLimitExceeded]: "Vượt quá giới hạn bộ nhớ",
  [SubmissionTestcaseStatus.RuntimeError]: "Lỗi thời gian chạy",
  [SubmissionTestcaseStatus.TimeLimitExceeded]: "Vượt quá giới hạn thời gian",
  [SubmissionTestcaseStatus.WrongAnswer]: "Sai kết quả",
  [SubmissionTestcaseStatus.Success]: "Chấp nhận",
  [SubmissionTestcaseStatus.RUNNING]: "Đang chạy",
  [SubmissionTestcaseStatus.NONE]: "",
};
export const SubmissionStatusVariant = {
  [SubmissionStatus.ACCEPTED]: "default",
  [SubmissionStatus.COMPILE_ERROR]: "danger",
  [SubmissionStatus.RUNTIME_ERROR]: "danger",
  [SubmissionStatus.DRAFT]: "secondary",
  [SubmissionStatus.MEMORY_LIMIT_EXCEEDED]: "danger",
  [SubmissionStatus.PENDING]: "secondary",
  [SubmissionStatus.WRONG_ANSWER]: "danger",
  [SubmissionStatus.TIME_LIMIT_EXCEEDED]: "danger",
};

const ERROR_OUTPUT = [
  SubmissionTestcaseStatus.CompileError,
  SubmissionTestcaseStatus.MemoryLimitExceeded,
  SubmissionTestcaseStatus.RuntimeError,
  SubmissionTestcaseStatus.WrongAnswer,
  SubmissionTestcaseStatus.TimeLimitExceeded,
];

export function getIsError(status: SubmissionTestcaseStatus) {
  return ERROR_OUTPUT.includes(status);
}

export const getStatusConfig = (status: SubmissionTestcaseStatus) => {
  switch (status) {
    case SubmissionTestcaseStatus.Success:
      return {
        badge: "bg-green-100 text-green-800",
        // icon: <LuCircleCheck className="h-4 w-4 text-green-600" />,
      };
    case SubmissionTestcaseStatus.RUNNING:
      return {
        badge: "bg-blue-100 text-blue-800",
        // icon: <LuLoader className="h-4 w-4 animate-spin text-blue-600" />,
      };
    case SubmissionTestcaseStatus.TimeLimitExceeded:
      return {
        badge: "bg-yellow-100 text-yellow-800",
        // icon: <LuClock className="h-4 w-4 text-yellow-600" />,
      };
    case SubmissionTestcaseStatus.NONE:
      return {
        badge: "bg-gray-100 text-gray-800",
        icon: null,
      };
    default:
      return {
        badge: "bg-red-100 text-red-800",
        // icon: <LuCircleX className="h-4 w-4 text-red-600" />,
      };
  }
};
