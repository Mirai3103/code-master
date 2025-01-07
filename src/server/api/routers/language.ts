import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  createLanguageSchema,
  updateLanguageSchema,
} from "@/server/schema/language.schema";
import { paginationQuerySchema } from "@/server/schema/pagination.schema";

export const languageRouter = createTRPCRouter({
  getLanguages: publicProcedure
    .input(
      paginationQuerySchema.extend({
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.services.language.findAll(input);
      return [result.data, result.total] as const;
    }),

  getLanguage: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.services.language.findByName(input);
    }),

  createLanguage: publicProcedure
    .input(createLanguageSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.services.language.create(input);
    }),

  updateLanguage: publicProcedure
    .input(updateLanguageSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.services.language.update(input.languageId, input);
    }),

  deleteLanguage: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.services.language.delete(input);
    }),

  toggleDisableLanguage: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.services.language.toggleActive(input);
    }),
});
