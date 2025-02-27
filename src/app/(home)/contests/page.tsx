"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  LuTrophy as Trophy,
  LuClock as Clock,
  LuUsers as Users,
  LuCalendar as Calendar,
  LuTimer as Timer,
  LuChevronRight as ChevronRight,
  LuChartBar as BarChart,
  LuCircleAlert as AlertCircle,
  LuSparkles,
} from "react-icons/lu";

const ContestPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingContests = [
    {
      id: 1,
      name: "Weekly Contest 375",
      time: "25/02/2025 09:30",
      duration: "1 giờ 30 phút",
      participants: 1234,
      difficulty: "Trung bình",
      status: "upcoming",
      type: "Weekly",
    },
    {
      id: 2,
      name: "Biweekly Contest 120",
      time: "26/02/2025 20:00",
      duration: "2 giờ",
      participants: 890,
      difficulty: "Khó",
      status: "upcoming",
      type: "Biweekly",
    },
  ];

  const ongoingContests = [
    {
      id: 3,
      name: "CodePro Cup 2025",
      timeLeft: "01:23:45",
      participants: 2500,
      difficulty: "Khó",
      status: "ongoing",
      type: "Special",
    },
  ];

  const topRankers = [
    { rank: 1, name: "NguyenVanA", rating: 2400, solved: 245, country: "VN" },
    { rank: 2, name: "TranThiB", rating: 2350, solved: 230, country: "VN" },
    { rank: 3, name: "LeVanC", rating: 2300, solved: 225, country: "VN" },
  ];

  const userStats = {
    globalRank: 1234,
    rating: 1856,
    contestsJoined: 25,
    averageRank: 450,
    bestRank: 123,
  };

  const recentResults = [
    { contest: "Weekly Contest 374", rank: 234, rating: "+15", solved: "3/4" },
    { contest: "Biweekly Contest 119", rank: 445, rating: "-5", solved: "2/4" },
    { contest: "Weekly Contest 373", rank: 334, rating: "+8", solved: "3/4" },
  ];

  return (
    <div className="space-y-6">
      {/* Banner Section */}
      <div className="relative h-64 overflow-hidden rounded-xl">
        <img
          src="https://placewaifu.com/image/1200/400"
          alt="Contest Banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-blue-900/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <h1 className="mb-2 text-3xl font-bold">CodePro Contest 2025</h1>
          <p className="text-lg opacity-90">
            Thách thức bản thân, Vươn tầm đẳng cấp
          </p>
          <Button className="mt-4 bg-white text-blue-900 hover:bg-blue-50">
            Khám Phá Ngay
          </Button>
        </div>
      </div>

      {/* Contest Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-linear-to-br from-purple-50 to-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Xếp hạng toàn cầu</p>
              <p className="text-2xl font-bold text-gray-900">
                #{userStats.globalRank}
              </p>
            </div>
            <div className="h-12 w-12 overflow-hidden rounded-full">
              <img
                src="https://placewaifu.com/image/100/100"
                alt="Rank"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </Card>
        {/* ... (các card stats khác tương tự) */}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Contest List Section */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          {/* Featured Contest */}
          <Card className="relative overflow-hidden">
            <img
              src="https://placewaifu.com/image/800/300"
              alt="Featured Contest"
              className="h-48 w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <div className="mb-2 flex items-center gap-2">
                <LuSparkles className="h-5 w-5" />
                <span className="text-sm font-medium">Cuộc Thi Đặc Biệt</span>
              </div>
              <h3 className="mb-2 text-2xl font-bold">
                CodePro Championship 2025
              </h3>
              <p className="mb-4 opacity-90">
                Giải thưởng lên đến 100 triệu đồng
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  28/02/2025
                </span>
                <span className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  2,500+ đăng ký
                </span>
              </div>
            </div>
          </Card>

          {/* Ongoing Contests */}
          {ongoingContests.length > 0 && (
            <div>
              <h2 className="mb-4 flex items-center text-lg font-semibold">
                <AlertCircle className="mr-2 h-5 w-5 text-green-500" />
                Đang Diễn Ra
              </h2>
              {ongoingContests.map((contest) => (
                <Card key={contest.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="w-1/4">
                      <img
                        src={`https://placewaifu.com/image/300/200`}
                        alt={contest.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {contest.name}
                          </h3>
                          <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Timer className="mr-1 h-4 w-4" />
                              Còn lại: {contest.timeLeft}
                            </span>
                            <span className="flex items-center">
                              <Users className="mr-1 h-4 w-4" />
                              {contest.participants} người tham gia
                            </span>
                          </div>
                        </div>
                        <Button className="bg-green-600 hover:bg-green-700">
                          Tham Gia Ngay
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Upcoming Contests */}
          <div>
            <h2 className="mb-4 flex items-center text-lg font-semibold">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Sắp Diễn Ra
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {upcomingContests.map((contest) => (
                <Card
                  key={contest.id}
                  className="overflow-hidden transition-all hover:shadow-lg"
                >
                  <div className="flex">
                    <div className="w-1/3">
                      <img
                        src={`https://placewaifu.com/image/400/250`}
                        alt={contest.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {contest.name}
                        </h3>
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600">
                          {contest.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          {contest.time}
                        </span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {contest.duration}
                        </span>
                        <span className="flex items-center">
                          <Users className="mr-1 h-4 w-4" />
                          {contest.participants} người tham gia
                        </span>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline">Đăng Ký</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 space-y-6 lg:col-span-4">
          {/* Top Rankers */}
          <Card className="overflow-hidden">
            <div className="relative h-32">
              <img
                src="https://placewaifu.com/image/400/200"
                alt="Top Rankers"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/70" />
              <h2 className="absolute bottom-4 left-4 flex items-center text-lg font-semibold text-white">
                <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                Top Cao Thủ
              </h2>
            </div>
            <div className="space-y-4 p-4">
              {topRankers.map((ranker, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={`https://placewaifu.com/image/40/40`}
                        alt={ranker.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <span
                        className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                              ? "bg-gray-400"
                              : "bg-orange-500"
                        } text-white`}
                      >
                        {ranker.rank}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{ranker.name}</p>
                      <p className="text-sm text-gray-500">
                        {ranker.solved} bài giải
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-blue-600">
                    {ranker.rating}
                  </span>
                </div>
              ))}
              <Button variant="outline" className="mt-2 w-full">
                Xem Bảng Xếp Hạng
              </Button>
            </div>
          </Card>

          {/* Recent Contest Results */}
          <Card className="overflow-hidden">
            <div className="relative h-32">
              <img
                src="https://placewaifu.com/image/400/200"
                alt="Recent Results"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/70" />
              <h2 className="absolute bottom-4 left-4 flex items-center text-lg font-semibold text-white">
                <BarChart className="mr-2 h-5 w-5" />
                Kết Quả Gần Đây
              </h2>
            </div>
            <div className="space-y-4 p-4">
              {recentResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {result.contest}
                    </p>
                    <p className="text-sm text-gray-500">
                      Rank: #{result.rank}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        result.rating.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {result.rating}
                    </p>
                    <p className="text-sm text-gray-500">{result.solved}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContestPage;
