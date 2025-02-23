"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LuSearch as Search,
  LuCircleCheck as CheckCircle2,
  LuCircle as Circle,
  LuLock as Lock,
  LuTrophy as Trophy,
  LuClock as Clock,
  LuChartBar as BarChart2,
  LuBookOpen as BookOpen,
  LuCalendar as Calendar,
  LuUsers as Users,
  LuBrainCircuit,
  LuLaptop,
} from "react-icons/lu";

const ProblemSet = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const problems = [
    {
      id: 1,
      title: "Tổng Hai Số",
      difficulty: "Dễ",
      acceptance: "75%",
      status: "solved",
      isPremium: false,
      category: "Array",
    },
    {
      id: 2,
      title: "Chuỗi Palindrome",
      difficulty: "Trung bình",
      acceptance: "45%",
      status: "attempted",
      isPremium: false,
      category: "String",
    },
    {
      id: 3,
      title: "Cây Nhị Phân Cân Bằng",
      difficulty: "Khó",
      acceptance: "32%",
      status: null,
      isPremium: true,
      category: "Tree",
    },
    {
      id: 4,
      title: "Tìm Đường Trong Ma Trận",
      difficulty: "Trung bình",
      acceptance: "48%",
      status: null,
      isPremium: false,
      category: "Graph",
    },
    {
      id: 5,
      title: "Sắp Xếp Nhanh",
      difficulty: "Dễ",
      acceptance: "65%",
      status: "solved",
      isPremium: false,
      category: "Sorting",
    },
  ];

  const dailyChallenge = {
    title: "Ma Trận Xoắn Ốc",
    difficulty: "Trung bình",
    points: 50,
    submissions: 234,
    timeLeft: "14:25:31",
  };

  const learningPath = {
    currentPath: "Cấu Trúc Dữ Liệu Cơ Bản",
    progress: 65,
    nextTopic: "Binary Search Tree",
    completedTopics: 13,
    totalTopics: 20,
  };

  const userStats = {
    rank: 1234,
    totalSolved: 127,
    streak: 15,
    contestRating: 1756,
  };

  const contests = [
    { name: "Weekly Contest 375", time: "Chủ Nhật, 9:30", participants: 1200 },
    { name: "Biweekly Contest 120", time: "Thứ 7, 20:00", participants: 800 },
  ];

  const studyPlans = [
    { name: "LeetCode 75", progress: 80, totalDays: 75 },
    { name: "SQL 50", progress: 30, totalDays: 50 },
    { name: "Programming Skills", progress: 45, totalDays: 60 },
  ];

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

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "solved":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "attempted":
        return <Circle className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const ProgressBar = ({ progress }: { progress: number }) => (
    <div className="h-2 w-full rounded-full bg-gray-200">
      <div
        className="h-2 rounded-full bg-blue-600 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3 space-y-6">
            {/* Daily Challenge */}
            <Card className="p-4">
              <h3 className="mb-3 flex items-center text-lg font-semibold">
                <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                Thử Thách Hôm Nay
              </h3>
              <div className="space-y-3">
                <div className="font-medium text-gray-900">
                  {dailyChallenge.title}
                </div>
                <div className="flex justify-between text-sm">
                  <span
                    className={`rounded-full px-2 py-1 ${getDifficultyColor(dailyChallenge.difficulty)} ${getDifficultyBg(dailyChallenge.difficulty)}`}
                  >
                    {dailyChallenge.difficulty}
                  </span>
                  <span className="text-gray-600">
                    +{dailyChallenge.points} điểm
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{dailyChallenge.submissions} lượt nộp</span>
                  <span className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {dailyChallenge.timeLeft}
                  </span>
                </div>
                <Button className="w-full">Giải Ngay</Button>
              </div>
            </Card>

            {/* Learning Progress */}
            <Card className="p-4">
              <h3 className="mb-3 flex items-center text-lg font-semibold">
                <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                Lộ Trình Học Tập
              </h3>
              <div className="space-y-3">
                <div className="font-medium text-gray-900">
                  {learningPath.currentPath}
                </div>
                <ProgressBar progress={learningPath.progress} />
                <div className="text-sm text-gray-600">
                  {learningPath.completedTopics}/{learningPath.totalTopics} chủ
                  đề
                </div>
                <div className="text-sm text-gray-600">
                  Tiếp theo: {learningPath.nextTopic}
                </div>
                <Button variant="outline" className="w-full">
                  Tiếp Tục Học
                </Button>
              </div>
            </Card>

            {/* Upcoming Contests */}
            <Card className="p-4">
              <h3 className="mb-3 flex items-center text-lg font-semibold">
                <Trophy className="mr-2 h-5 w-5 text-blue-600" />
                Cuộc Thi Sắp Tới
              </h3>
              <div className="space-y-4">
                {contests.map((contest, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="font-medium text-gray-900">
                      {contest.name}
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {contest.time}
                      </span>
                      <span className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        {contest.participants}
                      </span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Xem Tất Cả
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-6 space-y-6">
            {/* Filters */}
            <Card className="p-6">
              <div className="flex flex-wrap gap-4">
                <div className="relative min-w-[200px] flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm bài tập..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Độ Khó" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất Cả</SelectItem>
                    <SelectItem value="easy">Dễ</SelectItem>
                    <SelectItem value="medium">Trung Bình</SelectItem>
                    <SelectItem value="hard">Khó</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Trạng Thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất Cả</SelectItem>
                    <SelectItem value="solved">Đã Giải</SelectItem>
                    <SelectItem value="attempted">Đã Thử</SelectItem>
                    <SelectItem value="unsolved">Chưa Giải</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Problems List */}
            <Card className="overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 border-b border-gray-200 bg-gray-50 px-6 py-3">
                <div className="col-span-1 font-medium text-gray-500">STT</div>
                <div className="col-span-5 font-medium text-gray-500">
                  Tiêu Đề
                </div>
                <div className="col-span-2 font-medium text-gray-500">
                  Độ Khó
                </div>
                <div className="col-span-2 font-medium text-gray-500">
                  Accept
                </div>
                <div className="col-span-2 font-medium text-gray-500">
                  Trạng Thái
                </div>
              </div>

              {/* Table Body */}
              {problems.map((problem) => (
                <div
                  key={problem.id}
                  className="grid cursor-pointer grid-cols-12 gap-4 border-b border-gray-200 px-6 py-4 transition-colors hover:bg-gray-50"
                >
                  <div className="col-span-1 text-gray-500">{problem.id}</div>
                  <div className="col-span-5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {problem.title}
                      </span>
                      {problem.isPremium && (
                        <Lock className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {problem.category}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${getDifficultyColor(problem.difficulty)} ${getDifficultyBg(problem.difficulty)}`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="col-span-2 text-gray-600">
                    {problem.acceptance}
                  </div>
                  <div className="col-span-2">
                    {getStatusIcon(problem.status)}
                  </div>
                </div>
              ))}
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Hiển thị 1-{problems.length} trong tổng số {problems.length} bài
                tập
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

          {/* Right Sidebar */}
          <div className="col-span-3 space-y-6">
            {/* Personal Stats */}
            <Card className="p-4">
              <h3 className="mb-4 flex items-center text-lg font-semibold">
                <BarChart2 className="mr-2 h-5 w-5 text-blue-600" />
                Thống Kê Cá Nhân
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Contest Rating</span>
                  <span className="font-medium text-blue-600">
                    {userStats.contestRating}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bài đã giải</span>
                  <span className="font-medium text-green-600">
                    {userStats.totalSolved}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Streak hiện tại</span>
                  <span className="font-medium text-yellow-600">
                    {userStats.streak} ngày
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Xếp hạng</span>
                  <span className="font-medium text-purple-600">
                    Top {userStats.rank}
                  </span>
                </div>
              </div>
            </Card>

            {/* Topic Progress */}
            <Card className="p-4">
              <h3 className="mb-4 flex items-center text-lg font-semibold">
                <LuBrainCircuit className="mr-2 h-5 w-5 text-blue-600" />
                Tiến Độ Theo Chủ Đề
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-gray-600">Arrays & Strings</span>
                    <span className="text-sm text-gray-600">75%</span>
                  </div>
                  <ProgressBar progress={75} />
                </div>
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-gray-600">Dynamic Programming</span>
                    <span className="text-sm text-gray-600">45%</span>
                  </div>
                  <ProgressBar progress={45} />
                </div>
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-gray-600">Trees & Graphs</span>
                    <span className="text-sm text-gray-600">60%</span>
                  </div>
                  <ProgressBar progress={60} />
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Xem Chi Tiết
              </Button>
            </Card>

            {/* Recommended Problems */}
            <Card className="p-4">
              <h3 className="mb-4 flex items-center text-lg font-semibold">
                <LuLaptop className="mr-2 h-5 w-5 text-blue-600" />
                Đề Xuất Cho Bạn
              </h3>
              <div className="space-y-4">
                {problems.slice(0, 3).map((problem, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {problem.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {problem.category}
                      </div>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemSet;
