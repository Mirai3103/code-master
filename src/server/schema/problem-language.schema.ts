import { z } from "zod";

const language = z.object({
  languageId: z.coerce.number(),
});

export const bulkLanguagesProblemSchema = z.object({
  problemId: z.string(),
  removeLanguage: z.array(language),
  addLanguage: z.array(
    language.extend({
      templateCode: z.string().optional(),
      timeLimit: z.coerce.number().optional(),
      memoryLimit: z.coerce.number().optional(),
    }),
  ),
});

export type BulkLanguagesProblem = z.infer<typeof bulkLanguagesProblemSchema>;
