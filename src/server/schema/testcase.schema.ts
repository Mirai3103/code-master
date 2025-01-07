import { z } from "zod";

// Định nghĩa schema mới với các trường rõ ràng
export const newTestCaseSchema = z.object({
  testCaseId: z
    .string()
    .uuid({ message: "Id của test case phải là một UUId hợp lệ" }),
  problemId: z
    .string()
    .uuid({ message: "Id của bài tập phải là một UUId hợp lệ" })
    .nonempty({ message: "Id của bài tập không được để trống" }),
  inputData: z
    .string()
    .nonempty({ message: "Dữ liệu đầu vào không được để trống" }),
  expectedOutput: z
    .string()
    .nonempty({ message: "Kết quả mong đợi không được để trống" }),
  isSample: z
    .boolean({ invalid_type_error: "isSample phải là kiểu boolean" })
    .default(false),
  points: z
    .number()
    .min(0, { message: "Điểm phải lớn hơn hoặc bằng 0" })
    .default(0),
  label: z
    .string()
    .max(50, { message: "Nhãn không được dài quá 50 ký tự" })
    .nullish(),
  explanation: z.union([z.string(), z.object({})]).nullish(),
  createdAt: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Ngày tạo phải là một ngày hợp lệ",
    }),
  updatedAt: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Ngày cập nhật phải là một ngày hợp lệ",
    }),
});

// Loại trích xuất từ schema
export type NewTestCaseInput = z.infer<typeof newTestCaseSchema>;
export type TestCase = NewTestCaseInput;
