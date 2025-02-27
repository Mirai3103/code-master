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
  LuCircleAlert as AlertCircle,
  LuFileText as FileText,
  LuGift as Gift,
  LuCircleCheck as CheckCircle,
  LuChevronRight as ChevronRight,
  LuStar as Star,
  LuGlobe as Globe,
  LuBookOpen as BookOpen,
  LuMessageSquare as MessageSquare,
} from "react-icons/lu";

const ContestDetail = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const contestInfo = {
    name: "CodePro Championship 2025",
    startTime: "28/02/2025 09:30 GMT+7",
    duration: "4 giờ",
    participants: 2500,
    difficulty: "Khó",
    rating: "1600+",
    prizes: {
      first: "50.000.000 VNĐ",
      second: "30.000.000 VNĐ",
      third: "20.000.000 VNĐ",
    },
    description:
      "Cuộc thi lập trình lớn nhất năm 2025 với tổng giải thưởng lên đến 100 triệu đồng. Thách thức bản thân với các bài toán từ cơ bản đến nâng cao, đặc biệt tập trung vào thuật toán và cấu trúc dữ liệu.",
    rules: [
      "Thời gian làm bài: 4 giờ",
      "5 bài tập với độ khó tăng dần",
      "Được sử dụng các ngôn ngữ: C++, Java, Python",
      "Không được sử dụng AI hoặc công cụ tự động",
      "Có thể nộp bài nhiều lần trong thời gian thi",
    ],
  };

  const problems = [
    {
      id: "A",
      name: "Sum Array",
      difficulty: "Dễ",
      points: 100,
      submissions: 1200,
      accepted: 800,
    },
    {
      id: "B",
      name: "Binary Tree Balance",
      difficulty: "Trung bình",
      points: 200,
      submissions: 900,
      accepted: 450,
    },
    {
      id: "C",
      name: "Dynamic Programming",
      difficulty: "Trung bình",
      points: 300,
      submissions: 700,
      accepted: 300,
    },
    {
      id: "D",
      name: "Graph Algorithm",
      difficulty: "Khó",
      points: 400,
      submissions: 400,
      accepted: 100,
    },
    {
      id: "E",
      name: "Hard Problem",
      difficulty: "Rất khó",
      points: 500,
      submissions: 200,
      accepted: 30,
    },
  ];

  const leaderboard = [
    {
      rank: 1,
      name: "nguyenvanA",
      score: 1500,
      solved: "5/5",
      country: "VN",
      time: "3:45:20",
    },
    {
      rank: 2,
      name: "tranthiB",
      score: 1400,
      solved: "4/5",
      country: "VN",
      time: "3:50:15",
    },
    {
      rank: 3,
      name: "levanC",
      score: 1300,
      solved: "4/5",
      country: "VN",
      time: "3:55:30",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Contest Header Banner */}
      <div className="relative h-80 overflow-hidden rounded-xl">
        <img
          src="https://placewaifu.com/image/1200/400"
          alt="Contest Banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-blue-900/90 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-400" />
            <span className="rounded-full bg-blue-500/30 px-3 py-1 text-sm font-medium">
              Special Event
            </span>
          </div>
          <h1 className="mb-2 text-4xl font-bold">{contestInfo.name}</h1>
          <div className="mt-4 flex items-center gap-6 text-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{contestInfo.startTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{contestInfo.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{contestInfo.participants}+ participants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contest Status */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-green-200 bg-green-50 p-6">
          <div className="flex items-center gap-4">
            <Timer className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-medium text-gray-900">Thời gian bắt đầu</h3>
              <p className="text-sm text-gray-600">2 ngày 15 giờ 30 phút</p>
            </div>
          </div>
        </Card>
        <Card className="border-blue-200 bg-blue-50 p-6">
          <div className="flex items-center gap-4">
            <Star className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-900">Yêu cầu Rating</h3>
              <p className="text-sm text-gray-600">{contestInfo.rating}</p>
            </div>
          </div>
        </Card>
        <Card className="border-purple-200 bg-purple-50 p-6">
          <div className="flex items-center gap-4">
            <Trophy className="h-8 w-8 text-purple-600" />
            <div>
              <h3 className="font-medium text-gray-900">Tổng giải thưởng</h3>
              <p className="text-sm text-gray-600">100.000.000 VNĐ</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            {["overview", "problems", "leaderboard", "submissions"].map(
              (tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "secondary" : "ghost"}
                  className={`rounded-none border-b-2 ${
                    activeTab === tab ? "border-blue-500" : "border-transparent"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Button>
              ),
            )}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Description */}
              <Card className="p-6">
                <h2 className="mb-4 flex items-center text-xl font-semibold">
                  <FileText className="mr-2 h-5 w-5 text-blue-500" />
                  Mô tả cuộc thi
                </h2>
                <p className="leading-relaxed text-gray-700">
                  {contestInfo.description}
                </p>
              </Card>

              {/* Rules */}
              <Card className="p-6">
                <h2 className="mb-4 flex items-center text-xl font-semibold">
                  <AlertCircle className="mr-2 h-5 w-5 text-blue-500" />
                  Luật thi đấu
                </h2>
                <ul className="space-y-3">
                  {contestInfo.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                      <span className="text-gray-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Prizes */}
              <Card className="p-6">
                <h2 className="mb-4 flex items-center text-xl font-semibold">
                  <Gift className="mr-2 h-5 w-5 text-blue-500" />
                  Giải thưởng
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-yellow-50 p-4 text-center">
                    <Trophy className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
                    <div className="font-semibold text-gray-900">Giải Nhất</div>
                    <div className="text-yellow-600">
                      {contestInfo.prizes.first}
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 text-center">
                    <Trophy className="mx-auto mb-2 h-8 w-8 text-gray-500" />
                    <div className="font-semibold text-gray-900">Giải Nhì</div>
                    <div className="text-gray-600">
                      {contestInfo.prizes.second}
                    </div>
                  </div>
                  <div className="rounded-lg bg-orange-50 p-4 text-center">
                    <Trophy className="mx-auto mb-2 h-8 w-8 text-orange-500" />
                    <div className="font-semibold text-gray-900">Giải Ba</div>
                    <div className="text-orange-600">
                      {contestInfo.prizes.third}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "problems" && (
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Danh sách bài tập</h2>
              <div className="space-y-4">
                {problems.map((problem) => (
                  <div
                    key={problem.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-200"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-blue-600">
                        {problem.id}
                      </span>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {problem.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                          <span>{problem.difficulty}</span>
                          <span>{problem.points} điểm</span>
                          <span>
                            {problem.accepted}/{problem.submissions} AC
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">
                      Giải bài
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === "leaderboard" && (
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Bảng xếp hạng</h2>
              <div className="space-y-4">
                {leaderboard.map((player) => (
                  <div
                    key={player.rank}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold ${
                          player.rank === 1
                            ? "bg-yellow-100 text-yellow-600"
                            : player.rank === 2
                              ? "bg-gray-100 text-gray-600"
                              : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {player.rank}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://placewaifu.com/image/32/32`}
                            alt={player.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <h3 className="font-medium text-gray-900">
                            {player.name}
                          </h3>
                          <span className="rounded bg-gray-100 px-2 py-0.5 text-sm text-gray-600">
                            {player.country}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-gray-600">
                      <div className="text-center">
                        <div className="font-medium">{player.score}</div>
                        <div className="text-sm text-gray-500">Điểm</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{player.solved}</div>
                        <div className="text-sm text-gray-500">Đã giải</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{player.time}</div>
                        <div className="text-sm text-gray-500">Thời gian</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-12 space-y-6 lg:col-span-4">
          {/* Registration Card */}
          <Card className="border-2 border-blue-200 p-6">
            <div className="mb-6 text-center">
              <h3 className="mb-2 text-xl font-semibold">Đăng ký tham gia</h3>
              <p className="text-gray-600">Hãy sẵn sàng cho thử thách!</p>
            </div>
            <Button className="mb-4 w-full bg-blue-600 hover:bg-blue-700">
              Đăng ký ngay
            </Button>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Trạng thái đăng ký</span>
                <span className="font-medium text-green-600">Đang mở</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Thời gian còn lại</span>
                <span className="font-medium">2 ngày 15:30:45</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Số người đăng ký</span>
                <span className="font-medium">2,500</span>
              </div>
            </div>
          </Card>

          {/* Contest Information */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Thông tin cuộc thi</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium">Hình thức</div>
                  <div className="text-sm text-gray-600">Online, Cá nhân</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium">Ngôn ngữ lập trình</div>
                  <div className="text-sm text-gray-600">C++, Java, Python</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium">Đối tượng tham gia</div>
                  <div className="text-sm text-gray-600">Rating 1600+</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium">Hỗ trợ</div>
                  <div className="text-sm text-gray-600">Discord, Email</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Registrations */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Đăng ký gần đây</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <img
                    src={`https://placewaifu.com/image/32/32`}
                    alt={`User ${index + 1}`}
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium">User_{index + 1}</div>
                    <div className="text-sm text-gray-500">2 phút trước</div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Xem tất cả người tham gia
              </Button>
            </div>
          </Card>

          {/* Related Contests */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Cuộc thi tương tự</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative mb-2 h-32 overflow-hidden rounded-lg">
                    <img
                      src={`https://placewaifu.com/image/300/200`}
                      alt={`Contest ${index + 1}`}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 text-white">
                      <div className="font-medium">
                        Weekly Contest {375 + index}
                      </div>
                      <div className="text-sm">28/02/2025</div>
                    </div>
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

export default ContestDetail;
