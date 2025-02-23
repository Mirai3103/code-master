"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  LuTrophy as Trophy,
  LuCalendar as Calendar,
  LuCode as Code2,
  LuSettings as Settings,
  LuUsers as Users,
  LuMessageSquare as MessageSquare,
  LuMap as Map,
  LuAward as Award,
} from "react-icons/lu";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const userInfo = {
    name: "Nguyen Van A",
    username: "nguyenvana",
    avatar: "https://placewaifu.com/image/150/150",
    title: "Senior Developer",
    location: "Ho Chi Minh City",
    joined: "Tháng 3, 2023",
    bio: "Full-stack developer với niềm đam mê giải thuật. Thích chia sẻ kiến thức và học hỏi từ cộng đồng.",
    social: {
      github: "github.com/nguyenvana",
      linkedin: "linkedin.com/in/nguyenvana",
      email: "nguyenvana@email.com",
    },
  };

  const userStats = {
    rating: 2156,
    rank: 234,
    problemsSolved: 458,
    submissions: 789,
    contestJoined: 45,
    contributions: 156,
  };

  const recentActivities = [
    {
      type: "problem",
      name: "Two Sum",
      result: "Accepted",
      time: "2 giờ trước",
      language: "Python",
    },
    {
      type: "contest",
      name: "Weekly Contest 375",
      result: "Rank 123",
      time: "1 ngày trước",
      score: 1500,
    },
    {
      type: "discussion",
      name: "Tối ưu Dijkstra Algorithm",
      result: "15 likes",
      time: "3 ngày trước",
    },
  ];

  const achievements = [
    {
      title: "Problem Solver III",
      description: "Giải 100 bài khó",
      icon: Trophy,
      color: "text-yellow-500",
      bg: "bg-yellow-100",
    },
    {
      title: "Contest Master",
      description: "Top 10 trong 5 cuộc thi",
      icon: Award,
      color: "text-purple-500",
      bg: "bg-purple-100",
    },
    {
      title: "Active Contributor",
      description: "100 bài viết có ích",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
  ];

  const submissions = [
    { name: "Array", solved: 120, total: 150 },
    { name: "String", solved: 95, total: 120 },
    { name: "Dynamic Programming", solved: 75, total: 100 },
    { name: "Tree", solved: 60, total: 80 },
    { name: "Graph", solved: 45, total: 60 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 overflow-hidden rounded-xl">
          <img
            src="https://placewaifu.com/image/1200/400"
            alt="Cover"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <div className="relative">
            <img
              src={userInfo.avatar}
              alt={userInfo.name}
              className="h-32 w-32 rounded-xl border-4 border-white shadow-lg"
            />
            <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white bg-green-500"></span>
          </div>
          <div className="mb-4 text-white">
            <h1 className="text-2xl font-bold">{userInfo.name}</h1>
            <p className="text-gray-200">@{userInfo.username}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="absolute -bottom-16 right-8 flex items-center gap-3">
          <Button variant="outline" className="bg-white">
            <Settings className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Users className="mr-2 h-4 w-4" />
            Theo dõi
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-20 grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-12 space-y-6 lg:col-span-3">
          {/* User Bio */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-600">
                {userInfo.title}
              </span>
              <span className="rounded-full bg-green-100 px-2 py-1 text-sm text-green-600">
                Verified
              </span>
            </div>
            <p className="mb-4 text-gray-600">{userInfo.bio}</p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                {userInfo.location}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Tham gia {userInfo.joined}
              </div>
            </div>
          </Card>

          {/* User Stats */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Thống kê</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rating</span>
                <span className="font-semibold text-blue-600">
                  {userStats.rating}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rank</span>
                <span className="font-semibold">#{userStats.rank}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Đã giải</span>
                <span className="font-semibold text-green-600">
                  {userStats.problemsSolved}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Submissions</span>
                <span className="font-semibold">{userStats.submissions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cuộc thi</span>
                <span className="font-semibold">{userStats.contestJoined}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Đóng góp</span>
                <span className="font-semibold">{userStats.contributions}</span>
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Thành tựu</h3>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`rounded-lg p-2 ${achievement.bg}`}>
                    <achievement.icon
                      className={`h-6 w-6 ${achievement.color}`}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {achievement.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {achievement.description}
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Xem tất cả thành tựu
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="col-span-12 space-y-6 lg:col-span-9">
          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            {["overview", "submissions", "contests", "discussions"].map(
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

          {/* Overview Content */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Recent Activities */}
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold">
                  Hoạt động gần đây
                </h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 rounded-lg p-3 hover:bg-gray-50"
                    >
                      <div
                        className={`rounded-lg p-2 ${
                          activity.type === "problem"
                            ? "bg-green-100"
                            : activity.type === "contest"
                              ? "bg-blue-100"
                              : "bg-purple-100"
                        }`}
                      >
                        {activity.type === "problem" ? (
                          <Code2 className="h-5 w-5 text-green-600" />
                        ) : activity.type === "contest" ? (
                          <Trophy className="h-5 w-5 text-blue-600" />
                        ) : (
                          <MessageSquare className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">
                            {activity.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {activity.time}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {activity.result}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Submission Stats */}
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold">
                  Thống kê bài giải
                </h3>
                <div className="space-y-4">
                  {submissions.map((category, index) => (
                    <div key={index}>
                      <div className="mb-1 flex justify-between">
                        <span className="text-gray-600">{category.name}</span>
                        <span className="text-sm text-gray-500">
                          {category.solved}/{category.total}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{
                            width: `${(category.solved / category.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Calendar Contributions */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Đóng góp</h3>
                  <span className="text-sm text-gray-500">
                    156 đóng góp trong năm qua
                  </span>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  {/* Placeholder for contribution calendar */}
                  <div className="flex h-32 items-center justify-center text-gray-400">
                    Contribution Calendar Visualization
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
