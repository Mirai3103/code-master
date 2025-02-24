import { type trpc } from "@/trpc/server";

export type ProblemDetail = Awaited<
  ReturnType<typeof trpc.problems.getProblem>
>;
