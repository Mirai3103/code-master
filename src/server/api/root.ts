import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { tagRouter } from "./routers/tag";
import { languageRouter } from "./routers/language";
import { problemRouter } from "./routers/problem";
import { testcaseRouter } from "./routers/testcase";
import { submissionRouter } from "./routers/submission";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tags: tagRouter,
  languages: languageRouter,
  problems: problemRouter,
  testcases: testcaseRouter,
  submissions: submissionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
