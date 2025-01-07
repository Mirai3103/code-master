import TestcaseForm from "../_components/form";

export default async function CreateTestcaseModal({
  params,
}: {
  params: Promise<{ problem_id: string }>;
}) {
  const problemId = (await params).problem_id;
  return <TestcaseForm problem_id={problemId} type="create" />;
}
