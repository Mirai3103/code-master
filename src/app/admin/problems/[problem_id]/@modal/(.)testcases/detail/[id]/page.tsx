import { trpc } from "@/trpc/server";
import TestcaseForm from "../../_components/form";
interface Props {
  params: Promise<{ problem_id: string; id: string }>;
}
export default async function UpdateTestcase({ params }: Props) {
  const { problem_id, id } = await params;
  const testcase = await trpc.testcases.getTestcase({ testCaseId: id });

  return (
    <TestcaseForm
      problem_id={problem_id}
      type="update"
      testcase={testcase!}
    />
  );
}
