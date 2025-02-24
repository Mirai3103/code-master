"use client";
import { Card } from "@/app/_components/ui/card";
import { Problem } from "@/server/schema/problem.schema";
import {
  getDifficultyBg,
  getDifficultyColor,
  getDifficultyText,
} from "./utils";
import { LuCircle, LuCircleCheck } from "react-icons/lu";
import ProblemFilters from "./filter";
import PaginationList from "@/app/_components/PaginationList";
import usePaginationParams from "@/app/_hooks/use-pagination-params";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { useRouter } from "next/navigation";
interface Props {
  problems: Problem[];
  currentPage: number;
  totalPages: number;
}

export default function ProblemsTable({
  problems,
  currentPage,
  totalPages,
}: Props) {
  const [_, setParams] = usePaginationParams({});
  const handlePageChange = (page: number) => {
    setParams({
      page,
    });
  };
  const route = useRouter();
  return (
    <div className="col-span-6 space-y-6">
      {/* Filters */}
      <Card className="p-4 pb-2">
        <ProblemFilters />
      </Card>

      {/* Problems List */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[8%]">STT</TableHead>
              <TableHead className="w-[50%]">Tiêu Đề</TableHead>
              <TableHead className="w-[17%]">Độ Khó</TableHead>
              <TableHead className="w-[12%]">Tỉ lệ chấp thuận</TableHead>
              <TableHead className="w-[13%]">Trạng Thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems.map((problem, index) => (
              <TableRow
                key={problem.problemId}
                onClick={() => route.push(`/problems/${problem.problemId}`)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell className="text-gray-500">
                  {(currentPage - 1) * 20 + index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="line-clamp-2 font-medium text-gray-900">
                      {problem.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${getDifficultyColor(problem.difficultyLevel)} ${getDifficultyBg(problem.difficultyLevel)}`}
                  >
                    {getDifficultyText(problem.difficultyLevel)}
                  </span>
                </TableCell>
                <TableCell className="text-center text-gray-600">
                  {problem.acceptedSubmissions}/{problem.totalSubmissions}
                </TableCell>
                <TableCell className="flex justify-center">
                  {getStatusIcon("attempted")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <PaginationList
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
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
