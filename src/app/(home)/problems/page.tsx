import ProblemOfTheDay from "./problem-of-the-day";
import StudyPlan from "./study-plan";
import UpcomingContest from "./upcoming-contest";
import UserStats from "./user-stats";
import TopicProcess from "./topic-process";
import RecommendProblem from "./recommend-problem";
import ProblemsTable from "./problems-table";
import { HydrateClient, trpc } from "@/trpc/server";

interface Props {
  searchParams: Promise<{
    search?: string;
    difficulty?: number;
    tags?: string[];
    page?: number;
    pageSize?: number;
  }>;
}

const ProblemSet = async () => {
  const data = await trpc.problems.getProblems({
    isPublic: true,
    pageSize: 20,
    page: 1,
  });
  return (
    <HydrateClient>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="col-span-3 space-y-6">
              {/* Daily Challenge */}
              <ProblemOfTheDay />

              {/* Learning Progress */}
              <StudyPlan />
              {/* Upcoming Contests */}
              <UpcomingContest />
            </div>
            {/* Main Content */}
            <ProblemsTable problems={data[0] as never[]} />
            {/* Right Sidebar */}
            <div className="col-span-3 space-y-6">
              {/* Personal Stats */}
              <UserStats />

              {/* Topic Progress */}
              <TopicProcess />

              {/* Recommended Problems */}
              <RecommendProblem />
            </div>
          </div>
        </main>
      </div>
    </HydrateClient>
  );
};

export default ProblemSet;
