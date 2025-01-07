import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { newTestCaseSchema } from "@/server/schema/testcase.schema";

export const testcaseRouter = createTRPCRouter({
  getTestcases: publicProcedure
    .input(
      z.object({
        problemId: z.string(),
        withAllTestcases: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const testcases = await ctx.services.testcase.findByProblemId(
        input.problemId,
        input.withAllTestcases,
      );
      return testcases;
    }),
  getPublicTestcases: publicProcedure
    .input(
      z.object({
        problemId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const testcases = await ctx.services.testcase.findPublicTestcases(
        input.problemId,
      );
      return testcases;
    }),

  getTestcase: publicProcedure
    .input(
      z.object({
        testCaseId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const testcase = await ctx.services.testcase.findByTestcaseId(
        input.testCaseId,
      );
      return testcase;
    }),

  createTestcase: publicProcedure
    .input(newTestCaseSchema)
    .mutation(async ({ ctx, input }) => {
      const testcase = await ctx.services.testcase.create(input);
      return testcase;
    }),
  updateTestcase: publicProcedure
    .input(
      newTestCaseSchema.extend({
        testCaseId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const testcase = await ctx.services.testcase.update(input);
      return testcase;
    }),
  deleteTestcase: publicProcedure
    .input(
      z.object({
        testCaseId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.services.testcase.delete(input.testCaseId);
      return result;
    }),

  clearTestcases: publicProcedure
    .input(
      z.object({
        problemId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.services.testcase.clearTestcases(
        input.problemId,
      );
      return result;
    }),
  createTestcases: publicProcedure
    .input(z.array(newTestCaseSchema))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.services.testcase.createMany(input);
      return result;
    }),
  bulkDeleteTestcases: publicProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.services.testcase.bulkDelete(input);
      return result;
    }),
});
