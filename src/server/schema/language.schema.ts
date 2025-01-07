import { type Language as PrismaLanguage } from "@prisma/client";
import { z } from "zod";

export const createLanguageSchema = z.object({
  languageName: z
    .string()
    .min(1, "Tên ngôn ngữ không được để trống")
    .max(50, "Tên ngôn ngữ không được vượt quá 50 ký tự"),

  version: z
    .string()
    .min(1, "Phiên bản không được để trống")
    .max(50, "Phiên bản không được vượt quá 50 ký tự"),

  sourceFileExt: z
    .string()
    .min(1, "Phần mở rộng tệp nguồn không được để trống")
    .max(10, "Phần mở rộng tệp nguồn không được vượt quá 10 ký tự"),
  binaryFileExt: z
    .string()
    .max(10, "Phần mở rộng tệp nhị phân không được vượt quá 10 ký tự")
    .nullish(),

  compileCommand: z
    .string()
    .max(100, "Lệnh biên dịch không được vượt quá 100 ký tự")
    .nullish(),

  runCommand: z
    .string()
    .min(1, "Lệnh chạy không được để trống")
    .max(100, "Lệnh chạy không được vượt quá 100 ký tự"),

  isActive: z.boolean().default(true),

  templateCode: z.string().default(""),

  canDelete: z.boolean().default(true),

  monacoCodeLanguage: z
    .string()
    .max(50, "Ngôn ngữ Monaco không được vượt quá 50 ký tự")
    .nullish()
    .default("plaintext"),
});

export const updateLanguageSchema = createLanguageSchema.partial().extend({
  languageId: z.number(),
});

export type CreateLanguageDTO = z.infer<typeof createLanguageSchema>;
export type UpdateLanguageDTO = z.infer<typeof updateLanguageSchema>;
export type Language = PrismaLanguage;
// {
// 	languageId: number;
// 	languageName: string;
// 	version: string;
// 	sourceFileExt: string;
// 	binaryFileExt?: string | null;
// 	compileCommand?: string | null;
// 	runCommand: string;
// 	isActive: boolean;
// 	templateCode: string;
// 	canDelete: boolean;
// 	monacoCodeLanguage?: string | null;
// };
