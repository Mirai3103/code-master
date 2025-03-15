import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/app/_components/ui/resizable";
import EditorSide from "./EditorSide";
import DetailSide from "./DetailSide";
import { trpc } from "@/trpc/server";
import { notFound } from "next/navigation";
import { can } from "@/util/getCurrentUser";
import { subject } from "@casl/ability";
import { Actions } from "@/constants/casl";
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
  const canReadProblem = await can(Actions.READ, subject("Problem", problem));
  if (!canReadProblem) {
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
