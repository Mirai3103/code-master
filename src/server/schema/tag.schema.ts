import { z } from "zod";

// Basic tag schema với các trường cơ bản
const tagBaseSchema = z.object({
  tagId: z.string().uuid("Id thẻ không hợp lệ").nullish(),
  tagName: z
    .string()
    .min(1, "Tên thẻ không được để trống")
    .max(100, "Tên thẻ không được vượt quá 100 ký tự")
    .trim(),
  description: z
    .string()
    .nullish()
    .transform((val) => val || null),
});

// Schema cho việc tạo mới tag
export const createTagSchema = tagBaseSchema.extend({
  createdBy: z.string().uuid("Id người tạo không hợp lệ").optional().nullable(),
});

// Schema cho việc cập nhật tag
export const updateTagSchema = tagBaseSchema
  .extend({
    tagId: z.string().uuid("Id thẻ không hợp lệ"),
    createdBy: z.string().uuid("Id người tạo không hợp lệ").nullish(),
  })
  .partial();

// Schema cho việc select/query tag
export const selectTagSchema = z.object({
  tagId: z.string(),
  tagName: z.string(),
  description: z.string().nullish(),
  createdAt: z.date(),
  createdBy: z.string().nullable(),
});

// Schema cho việc tạo nhiều tag cùng lúc
export const bulkCreateTagSchema = z.object({
  tags: z
    .array(createTagSchema)
    .min(1, "Cần ít nhất một thẻ")
    .max(50, "Không thể tạo quá 50 thẻ cùng lúc"),
});

// Type definitions
export type CreateTagDTO = z.infer<typeof createTagSchema>;
export type UpdateTagDTO = z.infer<typeof updateTagSchema>;
export type SelectTagDTO = z.infer<typeof selectTagSchema>;
export type BulkCreateTagDTO = z.infer<typeof bulkCreateTagSchema>;

// Type đầy đủ bao gồm cả relations
export type Tag = {
  tagId: string;
  tagName: string;
  description: string | null;
  createdAt: Date;
  createdBy: string | null;
  problemsTags?: Array<{
    problemId: string;
    tagId: string;
  }>;
};
