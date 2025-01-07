export enum DifficultyLevel {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
}
export function isDifficultyLevel(
  value: string | number | null | undefined,
): value is DifficultyLevel {
  return Object.values(DifficultyLevel).includes(Number(value));
}

export function parseDifficultyLevel(
  value: string | number | null | undefined,
): DifficultyLevel | undefined {
  if (!isDifficultyLevel(value)) return undefined;
  return Number(value);
}

export enum SubmissionStatus {
  PENDING = "PENDING",
  COMPILE_ERROR = "COMPILE_ERROR",
  RUNTIME_ERROR = "RUNTIME_ERROR",
  TIME_LIMIT_EXCEEDED = "TIME_LIMIT_EXCEEDED",
  MEMORY_LIMIT_EXCEEDED = "MEMORY_LIMIT_EXCEEDED",
  WRONG_ANSWER = "WRONG_ANSWER",
  ACCEPTED = "ACCEPTED",
  DRAFT = "DRAFT",
}

export enum SubmissionTestcaseStatus {
  Success = "Success",
  CompileError = "Compile Error",
  RuntimeError = "Runtime Error",
  WrongAnswer = "Wrong Answer",
  TimeLimitExceeded = "Time Limit Exceeded",
  MemoryLimitExceeded = "Memory Limit Exceeded",
  RUNNING = "Running",
  NONE = "None",
}
