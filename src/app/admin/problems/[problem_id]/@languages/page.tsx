import { trpc } from "@/trpc/server";
import CrudLanguage from "./_components/crud-language";

export default async function ProblemLanguagesPage({
  params,
}: {
  params: Promise<{ problem_id: string }>;
}) {
  const problemId = (await params).problem_id;
  const languagesPromise =
    trpc.problems.getFullLanguagesWithStatusForProblem(problemId);
  const problemPromise = trpc.problems.getBriefProblemById(problemId);
  // eslint-disable-next-line prefer-const
  let [languages, problem] = await Promise.all([
    languagesPromise,
    problemPromise,
  ]);
  languages = languages.map((language) => ({
    ...language,
    timeLimitInMs: language.timeLimitInMs || problem!.timeLimitInMs,
    memoryLimitInKb: language.memoryLimitInKb || problem!.memoryLimitInKb,
  }));
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between py-2">
          <p className="text-muted-foreground">
            Quản lý các ngôn ngữ lập trình mà bài toán hỗ trợ. {problemId}
          </p>
        </div>
      </div>
      <CrudLanguage languages={languages} problem={problem!} />
    </div>
  );
}
