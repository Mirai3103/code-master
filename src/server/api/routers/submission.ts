import { createTRPCRouter, publicProcedure } from "../trpc";
import { type SubmissionResult } from "@/server/grpc/generated/execution_service";
import { runCodeInput } from "@/server/schema/submission.dto";
import { type ClientReadableStream } from "@grpc/grpc-js";
import { z } from "zod";
function waitRandomTime() {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 1000);
  });
}
export const submissionRouter = createTRPCRouter({
  runCode: {
    iterable: publicProcedure.input(runCodeInput).mutation(async function* ({
      input,
      ctx: {
        services: { submission },
      },
    }) {
      // grpc call
      const readableStream: ClientReadableStream<SubmissionResult> =
        await submission.testRunCode(input);
      let submissionId = "";
      for await (const response of readableStream) {
        const result = response as SubmissionResult;
        if (!input.isTest) await submission.addSubmissionTestcaseResult(result);
        if (submissionId === "") {
          submissionId = result.submission_id;
        }
        yield {
          submissionId: result.submission_id,
          testCaseId: result.test_case_id,
          status: result.status,
          stdout: result.stdout,
          memoryUsage: result.memory_usage,
          timeUsage: result.time_usage,
        };
      }
      if (!input.isTest) await submission.recalculateSubmission(submissionId);
    }),
  },
  saveDraft: publicProcedure.input(runCodeInput).mutation(async function ({
    input,
    ctx: {
      services: { submission },
    },
  }) {
    return await submission.saveDraft(input);
  }),
  getLatestDraft: publicProcedure
    .input(z.object({ problemId: z.string(), languageId: z.number() }))

    .query(async function ({
      input,
      ctx: {
        services: { submission },
      },
    }) {
      return await submission.getLatestDraft(input.problemId, input.languageId);
    }),
  getSubmissionById: publicProcedure.input(z.string()).query(async function ({
    input,
    ctx: { services },
  }) {
    return await services.submission.getSubmissionById(input);
  }),
});
