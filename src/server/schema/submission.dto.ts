import z from "zod";

export const runCodeInput = z.object({
  code: z.string().min(1),
  userId: z.string(),
  problemId: z.string(),
  languageId: z.number(),
  isTest: z.boolean().default(true),
});

export type RunCodeInput = z.infer<typeof runCodeInput>;

// Enum cho trạng thái submission
export enum SubmissionStatus {
  PENDING = "PENDING",
  COMPILING = "COMPILING",
  RUNNING = "RUNNING",
  ACCEPTED = "ACCEPTED",
  WRONG_ANSWER = "WRONG_ANSWER",
  TIME_LIMIT_EXCEEDED = "TIME_LIMIT_EXCEEDED",
  MEMORY_LIMIT_EXCEEDED = "MEMORY_LIMIT_EXCEEDED",
  COMPILATION_ERROR = "COMPILATION_ERROR",
  RUNTIME_ERROR = "RUNTIME_ERROR",
}

// Base schema cho các trường chung
const submissionBaseSchema = z.object({
  userId: z
    .string()
    .uuid("Id người dùng không hợp lệ")
    .nonempty("Id người dùng không được để trống"),

  problemId: z
    .string()
    .uuid("Id bài toán không hợp lệ")
    .nonempty("Id bài toán không được để trống"),

  languageId: z
    .number()
    .int("Id ngôn ngữ phải là số nguyên")
    .positive("Id ngôn ngữ phải là số dương"),

  code: z
    .string()
    .min(1, "Mã nguồn không được để trống")
    .max(65535, "Mã nguồn quá dài"),

  status: z.nativeEnum(SubmissionStatus, {
    errorMap: () => ({ message: "Trạng thái không hợp lệ" }),
  }),

  timeExecution: z
    .number()
    .min(0, "Thời gian thực thi không được âm")
    .max(99.99, "Thời gian thực thi không hợp lệ"),

  memoryUsage: z
    .number()
    .min(0, "Bộ nhớ sử dụng không được âm")
    .max(9999.99, "Bộ nhớ sử dụng không hợp lệ")
    .default(256),

  submissionTime: z
    .date()
    .nullable()
    .default(() => new Date()),
});

// Schema cho việc tạo submission
export const createSubmissionSchema = submissionBaseSchema.extend({
  // Có thể thêm các trường đặc biệt cho create
});

// Schema cho việc cập nhật submission
export const updateSubmissionSchema = submissionBaseSchema
  .extend({
    submissionId: z.string().uuid("Id submission không hợp lệ"),
  })
  .partial();

// Schema cho việc select/query submission
export const selectSubmissionSchema = submissionBaseSchema.extend({
  submissionId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  deletedAt: z.date().nullable(),
  createdBy: z.string().uuid().nullable(),
  updatedBy: z.string().uuid().nullable(),
});

// Type definitions
export type CreateSubmissionDTO = z.infer<typeof createSubmissionSchema>;
export type UpdateSubmissionDTO = z.infer<typeof updateSubmissionSchema>;
export type SelectSubmissionDTO = z.infer<typeof selectSubmissionSchema>;

// Type đầy đủ bao gồm cả relations
export type Submission = {
  submissionId: string;
  userId: string;
  problemId: string;
  languageId: number;
  code: string;
  status: SubmissionStatus;
  timeExecution: number;
  memoryUsage: number;
  submissionTime: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;

  // Relations
  problem?: {
    problemId: string;
    title: string;
    // other Problem fields...
  };
  submission_testcases?: Array<{
    submissionId: string;
    testcaseId: string;
    status: string;
    timeExecution: number;
    memoryUsage: number;
    // other fields...
  }>;
};
