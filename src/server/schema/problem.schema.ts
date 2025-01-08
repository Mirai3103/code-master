import { z } from "zod";
import { DifficultyLevel, parseDifficultyLevel } from "./enum";
import { paginationQuerySchema } from "./pagination.schema";
import { type Problem as PrismaProblem } from "@prisma/client";
export const createProblemSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề bài toán không được để trống")
    .max(255, "Tiêu đề bài toán không được vượt quá 255 ký tự"),

  description: z.any().optional().describe("Mô tả chi tiết về bài toán"),

  problemStatement: z
    .union([z.string(), z.object({})])
    .describe("Đề bài")
    .refine((val) => val != null, "Đề bài không được để trống"),

  difficultyLevel: z
    .preprocess(
      (val) => {
        return parseDifficultyLevel(val as string);
      },
      z.nativeEnum(DifficultyLevel, {
        errorMap: () => ({ message: "Mức độ khó không hợp lệ" }),
      }),
    )
    .default(DifficultyLevel.EASY),

  timeLimitInMs: z
    .number()
    .min(0, "Giới hạn thời gian không được âm")
    .max(100, "Giới hạn thời gian không được vượt quá 100 giây")
    .default(10),

  memoryLimitInKb: z
    .number()
    .min(0, "Giới hạn bộ nhớ không được âm")
    .max(1024, "Giới hạn bộ nhớ không được vượt quá 1024MB")
    .default(256),

  isPublic: z
    .boolean()
    .default(true)
    .describe("Trạng thái công khai của bài toán"),

  tags: z.array(
    z.object({
      tagId: z.string().min(1, "Id thẻ không được để trống"),
      name: z.string().optional(),
    }),
  ),
});

export const updateProblemSchema = createProblemSchema
  .extend({
    problemId: z.string().uuid("Id bài toán không hợp lệ"),
  })
  .partial();

export const problemQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  difficultyLevel: z.array(z.nativeEnum(DifficultyLevel)).optional(),
  isPublic: z.boolean().optional(),
});

export type ProblemQueryDTO = z.infer<typeof problemQuerySchema>;

export type CreateProblemDTO = z.infer<typeof createProblemSchema>;
export type UpdateProblemDTO = z.infer<typeof updateProblemSchema>;

export type Problem = PrismaProblem;
