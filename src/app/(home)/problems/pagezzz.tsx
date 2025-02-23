import UserStats from "./user-stats";
import HotProblems from "./hot-problems";
import UserProcess from "./user-process";
import ProblemsTable from "./table";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import ProblemFilters from "./filter";
import { parseDifficultyLevel } from "@/server/schema/enum";
import { trpc } from "@/trpc/server";
interface Props {
  searchParams: Promise<{
    search?: string;
    difficulty?: number;
    tags?: string[];
    page?: number;
    pageSize?: number;
  }>;
}

export default async function ProblemsPage({ searchParams }: Props) {
  const query = await searchParams;
  const difficultyLevel = parseDifficultyLevel(query.difficulty);
  const problems = await trpc.problems.getProblems({
    page: Number(query.page) || 1,
    pageSize: Number(query.pageSize) || 20,
    search: query.search,
    difficultyLevel: difficultyLevel ? [difficultyLevel] : undefined,
  });
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header with Stats */}
      <UserStats />

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <HotProblems />
            <UserProcess />
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {/* Filters */}
            <ProblemFilters />

            {/* Problems Table */}
            <ProblemsTable problems={problems[0]} />
            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Hiển thị 1-5 của 100 bài tập
              </div>
              <div className="flex gap-2">
                <PaginationWithLinks
                  page={query.page || 1}
                  pageSize={query.pageSize || 10}
                  totalCount={problems[1]}
                  pageSizeSelectOptions={{
                    pageSizeOptions: [10, 20, 50, 100],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
