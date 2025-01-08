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
      timeLimitInMs: z.coerce.number().optional(),
      memoryLimitInKb: z.coerce.number().optional(),
    }),
  ),
});

export type BulkLanguagesProblem = z.infer<typeof bulkLanguagesProblemSchema>;
