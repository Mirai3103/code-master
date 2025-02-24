import Header from "./header";
import DescriptionSide from "./description-side";
import EditorSide from "./editor-side";
import { notFound } from "next/navigation";
import { trpc } from "@/trpc/server";
interface Props {
  params: Promise<{
    id: string;
  }>;
}
export default async function ProblemDetail({ params }: Props) {
  const id = (await params).id;
  const problemPromise = trpc.problems.getProblem(id);
  const problemLanguagesPromise =
    trpc.problems.getActiveLanguagesForProblem(id);
  const [problem, problemLanguages] = await Promise.all([
    problemPromise,
    problemLanguagesPromise,
  ]);
  if (!problem) {
    notFound();
  }
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Left side - Problem description */}
        <DescriptionSide problem={problem} />
        <EditorSide languages={problemLanguages} problemId={id} />
        {/* Right side - Code editor */}
      </div>
    </div>
  );
}
