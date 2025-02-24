import { Card } from "@/app/_components/ui/card";
import { LuLaptop } from "react-icons/lu";
import { getDifficultyBg, getDifficultyColor } from "./utils";
import { Button } from "@/app/_components/ui/button";
import { DifficultyLevel } from "@/server/schema/enum";
const problems = [
  {
    id: 1,
    title: "Tổng Hai Số",
    difficulty: DifficultyLevel.EASY,
    acceptance: "75%",
    status: "solved",
    isPremium: false,
    category: "Array",
  },
  {
    id: 2,
    title: "Chuỗi Palindrome",
    difficulty: DifficultyLevel.MEDIUM,
    acceptance: "45%",
    status: "attempted",
    isPremium: false,
    category: "String",
  },
  {
    id: 3,
    title: "Cây Nhị Phân Cân Bằng",
    difficulty: DifficultyLevel.HARD,
    acceptance: "32%",
    status: null,
    isPremium: true,
    category: "Tree",
  },
];
export default function RecommendProblem() {
  return (
    <Card className="p-4">
      <h3 className="mb-4 flex items-center text-lg font-semibold">
        <LuLaptop className="mr-2 h-5 w-5 text-blue-600" />
        Đề Xuất Cho Bạn
      </h3>
      <div className="space-y-4">
        {problems.slice(0, 3).map((problem, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">{problem.title}</div>
              <div className="text-sm text-gray-500">{problem.category}</div>
            </div>
            <span
              className={`rounded-full px-2 py-1 text-sm ${getDifficultyColor(problem.difficulty)} ${getDifficultyBg(problem.difficulty)}`}
            >
              {problem.difficulty}
            </span>
          </div>
        ))}
        <Button variant="outline" className="w-full">
          Xem Thêm
        </Button>
      </div>
    </Card>
  );
}
