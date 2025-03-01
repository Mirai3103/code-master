import ProblemOfTheDay from "./problem-of-the-day";
import UpcomingContest from "./upcoming-contest";
import UserStats from "./user-stats";
import TopicProcess from "./topic-process";
import RecommendProblem from "./recommend-problem";
import ProblemsTable from "./problems-table";
import { trpc } from "@/trpc/server";
import { QUERY_CONSTANTS } from "@/constants/query";

interface Props {
  searchParams: Promise<{
    search?: string;
    difficulty?: number;
    tags?: string[];
    page?: number;
    pageSize?: number;
  }>;
}

const ProblemSet = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const data = await trpc.problems.getProblems({
    isPublic: true,
    difficultyLevel: params.difficulty
      ? [Number(params.difficulty)]
      : undefined,
    ...params,
  });
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          {/* <div className="col-span-3 space-y-6"> */}
          {/* Daily Challenge */}
          {/* <ProblemOfTheDay /> */}

          {/* Learning Progress */}
          {/* <StudyPlan /> */}
          {/* Upcoming Contests */}
          {/* <UpcomingContest /> */}
          {/* </div> */}
          {/* Main Content */}
          <ProblemsTable
            className="col-span-9"
            problems={data[0] as never[]}
            currentPage={params.page || 1}
            totalPages={Math.ceil(
              data[1] / (params.pageSize || QUERY_CONSTANTS.DEFAULT_PAGE_SIZE),
            )}
          />
          {/* Right Sidebar */}
          <div className="col-span-3 space-y-6">
            {/* Personal Stats */}
            <UserStats />
            <ProblemOfTheDay />
            <UpcomingContest />

            {/* Topic Progress */}
            <TopicProcess />

            {/* Recommended Problems */}
            <RecommendProblem />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemSet;
