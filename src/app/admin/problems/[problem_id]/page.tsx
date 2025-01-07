"use server";

import { trpc } from "@/trpc/server";
import CreateForm from "../_components/create-form";
import { notFound } from "next/navigation";

export default async function EditProblem({
  params,
}: {
  params: Promise<{ problem_id: string }>;
}) {
  const problemId = (await params).problem_id;
  const problem = await trpc.problems.getProblem(problemId);
  if (!problem) {
    notFound();
  }
  return (
    <CreateForm
      initialValues={
        {
          ...problem,
          tags: [],
          selectedTags:
            problem?.problemTags?.map((tag) => ({
              value: tag.tag.tagId,
              label: tag.tag.tagName,
            })) || [],
          newTags: [],
          timeLimit: Number(problem.timeLimit.toNumber()),
          memoryLimit: Number(problem.memoryLimit.toNumber()),
          problemStatement: problem.problemStatement as object,

        }
      }
      type="update"
    />
  );
}
