import { Card } from "@/app/_components/ui/card";
import { Problem } from "@/server/schema/problem.schema";
import {
  getDifficultyBg,
  getDifficultyColor,
  getDifficultyText,
} from "./utils";
import { LuCircle, LuCircleCheck } from "react-icons/lu";
import { Button } from "@/app/_components/ui/button";
import ProblemFilters from "./filter";
interface Props {
  problems: Problem[];
}

export default function ProblemsTable({ problems }: Props) {
  return (
    <div className="col-span-6 space-y-6">
      {/* Filters */}
      <Card className="p-4 pb-2">
        <ProblemFilters />
      </Card>

      {/* Problems List */}
      <Card className="overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 border-b border-gray-200 bg-gray-50 px-6 py-3">
          <div className="col-span-1 font-medium text-gray-500">STT</div>
          <div className="col-span-5 font-medium text-gray-500">Tiêu Đề</div>
          <div className="col-span-2 font-medium text-gray-500">Độ Khó</div>
          <div className="col-span-2 font-medium text-gray-500">Accept</div>
          <div className="col-span-2 font-medium text-gray-500">Trạng Thái</div>
        </div>

        {/* Table Body */}
        {problems.map((problem, index) => (
          <div
            key={problem.problemId}
            className="grid cursor-pointer grid-cols-12 gap-4 border-b border-gray-200 px-6 py-4 transition-colors hover:bg-gray-50"
          >
            <div className="col-span-1 text-gray-500">{index + 1}</div>
            <div className="col-span-5">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {problem.title}
                </span>
              </div>
            </div>
            <div className="col-span-2">
              <span
                className={`rounded-full px-3 py-1 text-sm ${getDifficultyColor(problem.difficultyLevel)} ${getDifficultyBg(problem.difficultyLevel)}`}
              >
                {getDifficultyText(problem.difficultyLevel)}
              </span>
            </div>
            <div className="col-span-2 text-gray-600">ádsad</div>
            <div className="col-span-2">{getStatusIcon(null)}</div>
          </div>
        ))}
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Hiển thị 1-{problems.length} trong tổng số {problems.length} bài tập
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            Trước
          </Button>
          <Button variant="outline" className="bg-blue-50 text-blue-600">
            1
          </Button>
          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline">Sau</Button>
        </div>
      </div>
    </div>
  );
}
const getStatusIcon = (status: string | null) => {
  switch (status) {
    case "solved":
      return <LuCircleCheck className="h-5 w-5 text-green-600" />;
    case "attempted":
      return <LuCircle className="h-5 w-5 text-yellow-600" />;
    default:
      return null;
  }
};
