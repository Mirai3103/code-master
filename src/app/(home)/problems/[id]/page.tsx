import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/app/_components/ui/resizable";
import EditorSide from "./EditorSide";
import DetailSide from "./DetailSide";
import { trpc } from "@/trpc/server";
import { notFound } from "next/navigation";
interface Props {
  params: Promise<{
    id: string;
  }>;
}
const ProblemSolvingPage = async ({ params }: Props) => {
  const id = (await params).id;
  const problemPromise = trpc.problems.getProblem(id);
  const problemLanguagesPromise =
    trpc.problems.getActiveLanguagesForProblem(id);
  const publicTestcasesPromise = trpc.testcases.getPublicTestcases({
    problemId: id,
  });
  const [problem, problemLanguages, publicTestcases] = await Promise.all([
    problemPromise,
    problemLanguagesPromise,
    publicTestcasesPromise,
  ]);
  if (!problem) {
    notFound();
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex h-screen bg-gray-50"
    >
      <DetailSide problem={problem} />
      <ResizableHandle withHandle />
      <EditorSide
        languagesOfProblem={problemLanguages}
        problem={problem}
        publicTestcases={publicTestcases}
      />
    </ResizablePanelGroup>
  );
};

export default ProblemSolvingPage;
