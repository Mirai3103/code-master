import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import { LuCalendar, LuClock } from "react-icons/lu";
const dailyChallenge = {
  title: "Ma Trận Xoắn Ốc",
  difficulty: "Trung bình",
  points: 50,
  submissions: 234,
  timeLeft: "14:25:31",
};
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Dễ":
      return "text-green-600";
    case "Trung bình":
      return "text-yellow-600";
    case "Khó":
      return "text-red-600";
    default:
      return "";
  }
};
const getDifficultyBg = (difficulty: string) => {
  switch (difficulty) {
    case "Dễ":
      return "bg-green-50";
    case "Trung bình":
      return "bg-yellow-50";
    case "Khó":
      return "bg-red-50";
    default:
      return "";
  }
};
export default function ProblemOfTheDay() {
  return (
    <Card className="p-4">
      <h3 className="mb-3 flex items-center text-lg font-semibold">
        <LuCalendar className="mr-2 h-5 w-5 text-blue-600" />
        Thử Thách Hôm Nay
      </h3>
      <div className="space-y-3">
        <div className="font-medium text-gray-900">{dailyChallenge.title}</div>
        <div className="flex justify-between text-sm">
          <span
            className={`rounded-full px-2 py-1 ${getDifficultyColor(dailyChallenge.difficulty)} ${getDifficultyBg(dailyChallenge.difficulty)}`}
          >
            {dailyChallenge.difficulty}
          </span>
          <span className="text-gray-600">+{dailyChallenge.points} điểm</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{dailyChallenge.submissions} lượt nộp</span>
          <span className="flex items-center">
            <LuClock className="mr-1 h-4 w-4" />
            {dailyChallenge.timeLeft}
          </span>
        </div>
        <Button className="w-full">Giải Ngay</Button>
      </div>
    </Card>
  );
}
