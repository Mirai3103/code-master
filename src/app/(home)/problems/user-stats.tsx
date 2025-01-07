"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  LuCircleCheck as CheckCircle2,
  LuTarget as Target,
  LuTrendingUp as TrendingUp,
  LuClock as Clock,
  LuStar as Star,
  LuBookOpen as BookOpen,
  LuFileCode2 as Code2,
} from "react-icons/lu";

const stats = [
  {
    title: "Đã hoàn thành",
    value: "25/100",
    icon: CheckCircle2,
    color: "text-green-600",
  },
  {
    title: "Độ khó trung bình",
    value: "Medium",
    icon: Target,
    color: "text-yellow-600",
  },
  {
    title: "Streak hiện tại",
    value: "7 ngày",
    icon: TrendingUp,
    color: "text-blue-600",
  },
  {
    title: "Thời gian code",
    value: "12.5 giờ",
    icon: Clock,
    color: "text-purple-600",
  },
];

export default function UserStats() {
  return (
    <div className="border-b bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Bài tập thuật toán
          </h1>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2">
              <Star className="h-4 w-4" />
              Bài tập yêu thích
            </Button>
            <Button variant="outline" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Học tập
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Code2 className="h-4 w-4" />
              Bài tập mới
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`rounded-lg bg-gray-100 p-3 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-lg font-semibold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
