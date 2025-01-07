import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  createProblemSchema,
  problemQuerySchema,
  updateProblemSchema,
} from "@/server/schema/problem.schema";
import { bulkLanguagesProblemSchema } from "@/server/schema/problem-language.schema";

export const problemRouter = createTRPCRouter({
  getProblems: publicProcedure
    .input(problemQuerySchema)
    .query(async ({ ctx, input }) => {
      const result = await ctx.services.problem.findAll(input);
      return [result.data, result.total] as const;
    }),

  getProblem: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.services.problem.findById(input);
  }),

  createProblem: publicProcedure
    .input(createProblemSchema)
    .mutation(({ ctx, input }) => {
      return ctx.services.problem.create(input);
    }),

  updateProblem: publicProcedure
    .input(updateProblemSchema)
    .mutation(({ ctx, input }) => {
      return ctx.services.problem.update(input.problemId!, input);
    }),

  deleteProblem: publicProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.services.problem.delete(input);
    }),

  togglePublicProblem: publicProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.services.problem.togglePublic(input);
    }),

  getProblemTags: publicProcedure.query(({ ctx }) => {
    return ctx.services.problem.getProblemTags();
  }),

  createProblemTag: publicProcedure
    .input(z.object({ problemId: z.string(), tagId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.services.problem.createProblemTag(input);
    }),

  getActiveLanguagesForProblem: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.services.problem.getActiveLanguagesForProblem(input);
    }),

  getFullLanguagesWithStatusForProblem: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.services.problem.getFullLanguagesWithStatusForProblem(input);
    }),

  getBriefProblemById: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.services.problem.getBriefProblemById(input);
    }),

  updateLanguagesForProblem: publicProcedure
    .input(bulkLanguagesProblemSchema)
    .mutation(({ ctx, input }) => {
      return ctx.services.problem.updateLanguagesForProblem(input);
    }),

  clearLanguagesForProblem: publicProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.services.problem.clearLanguagesForProblem(input);
    }),
});
