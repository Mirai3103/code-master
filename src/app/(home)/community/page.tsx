"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LuMessageSquare as MessageSquare,
  LuThumbsUp as ThumbsUp,
  LuEye as Eye,
  LuBookmark as Bookmark,
  LuTag as Tag,
  LuTrendingUp as TrendingUp,
  LuUsers as Users,
  LuSearch as Search,
  LuFilter as Filter,
  LuAward as Award,
  LuShare2 as Share2,
  LuCode as Code2,
  LuBookOpen,
  LuFileText,
  LuShield,
} from "react-icons/lu";
import { RxCheckCircled } from "react-icons/rx";

const CommunityPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const posts = [
    {
      id: 1,
      title: "Cách tối ưu thuật toán Dijkstra",
      author: {
        name: "NguyenVanA",
        avatar: "https://placewaifu.com/image/40/40",
        rank: "Expert",
        rating: 2000,
      },
      category: "algorithm",
      tags: ["graph", "optimization", "shortest-path"],
      likes: 156,
      comments: 23,
      views: 1.2,
      timeAgo: "2 giờ trước",
      solved: true,
      content:
        "Hôm nay mình muốn chia sẻ một số kỹ thuật tối ưu cho thuật toán Dijkstra...",
    },
    {
      id: 2,
      title: "Giúp mình debug bài Binary Tree",
      author: {
        name: "TranThiB",
        avatar: "https://placewaifu.com/image/40/40",
        rank: "Intermediate",
        rating: 1500,
      },
      category: "help",
      tags: ["tree", "debug", "binary-tree"],
      likes: 45,
      comments: 12,
      views: 0.8,
      timeAgo: "5 giờ trước",
      solved: false,
      content: "Mình đang gặp vấn đề với việc cân bằng cây nhị phân...",
    },
  ];

  const topTags = [
    { name: "dynamic-programming", count: 2456 },
    { name: "arrays", count: 2100 },
    { name: "string", count: 1890 },
    { name: "binary-tree", count: 1654 },
    { name: "graph", count: 1432 },
  ];

  const topUsers = [
    {
      name: "NguyenVanA",
      rating: 2400,
      contributions: 156,
      avatar: "https://placewaifu.com/image/40/40",
    },
    {
      name: "TranThiB",
      rating: 2350,
      contributions: 142,
      avatar: "https://placewaifu.com/image/40/40",
    },
    {
      name: "LeVanC",
      rating: 2300,
      contributions: 134,
      avatar: "https://placewaifu.com/image/40/40",
    },
  ];

  const categories = [
    { id: "all", name: "Tất cả", icon: MessageSquare },
    { id: "algorithm", name: "Thuật toán", icon: Code2 },
    { id: "help", name: "Hỏi đáp", icon: Users },
    { id: "discussion", name: "Thảo luận", icon: MessageSquare },
    { id: "news", name: "Tin tức", icon: TrendingUp },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Community Header */}
      <div className="relative mb-6 h-64 overflow-hidden rounded-xl">
        <img
          src="https://placewaifu.com/image/1200/400"
          alt="Community Banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/80" />
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold">Cộng Đồng CodePro</h1>
            <p className="mb-6 text-lg text-gray-200">
              Chia sẻ kiến thức, học hỏi và phát triển cùng nhau
            </p>
            <Button className="bg-white text-blue-900 hover:bg-blue-50">
              Tạo bài viết mới
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          {/* Filters and Search */}
          <div className="flex flex-wrap gap-4">
            <div className="relative min-w-[300px] flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
              <Input placeholder="Tìm kiếm bài viết..." className="pl-10" />
            </div>
            <Select defaultValue={selectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Phân loại" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center">
                      <category.icon className="mr-2 h-4 w-4" />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Lọc
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "secondary" : "ghost"
                }
                className="flex items-center gap-2"
                onClick={() => setSelectedCategory(category.id)}
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </Button>
            ))}
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="p-6 transition-colors hover:border-blue-200"
              >
                <div className="flex items-start gap-4">
                  {/* Author Info */}
                  <div className="flex-shrink-0 text-center">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="mx-auto mb-2 h-12 w-12 rounded-full"
                    />
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {post.author.name}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          post.author.rank === "Expert"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {post.author.rank}
                      </span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="mb-1 text-lg font-semibold text-gray-900">
                          {post.title}
                        </h3>
                        <div className="mb-2 flex items-center gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="mb-4 line-clamp-2 text-gray-600">
                      {post.content}
                    </p>

                    {/* Post Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {post.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views}k
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm">
                          <Share2 className="mr-1 h-4 w-4" />
                          Chia sẻ
                        </Button>
                        <span>{post.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 space-y-6 lg:col-span-4">
          {/* Community Stats */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Thống kê cộng đồng</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <Users className="mx-auto mb-2 h-6 w-6 text-blue-500" />
                <div className="font-semibold text-gray-900">15,234</div>
                <div className="text-sm text-gray-600">Thành viên</div>
              </div>
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <MessageSquare className="mx-auto mb-2 h-6 w-6 text-green-500" />
                <div className="font-semibold text-gray-900">45,678</div>
                <div className="text-sm text-gray-600">Bài viết</div>
              </div>
            </div>
          </Card>

          {/* Top Contributors */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center text-lg font-semibold">
              <Award className="mr-2 h-5 w-5 text-yellow-500" />
              Top đóng góp
            </h3>
            <div className="space-y-4">
              {topUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <span
                        className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                              ? "bg-gray-400"
                              : "bg-orange-500"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.contributions} đóng góp
                      </div>
                    </div>
                  </div>
                  <span className="font-semibold text-blue-600">
                    {user.rating}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Popular Tags */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center text-lg font-semibold">
              <Tag className="mr-2 h-5 w-5 text-blue-500" />
              Tags phổ biến
            </h3>
            <div className="flex flex-wrap gap-2">
              {topTags.map((tag) => (
                <Button key={tag.name} variant="outline" className="text-sm">
                  {tag.name}
                  <span className="ml-2 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs">
                    {tag.count}
                  </span>
                </Button>
              ))}
            </div>
          </Card>

          {/* Trending Topics */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center text-lg font-semibold">
              <TrendingUp className="mr-2 h-5 w-5 text-red-500" />
              Chủ đề hot
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative mb-2 h-32 overflow-hidden rounded-lg">
                    <img
                      src={`https://placewaifu.com/image/300/200`}
                      alt={`Topic ${index + 1}`}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 text-white">
                      <div className="font-medium">Dynamic Programming</div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          156
                        </span>
                        <span className="flex items-center">
                          <Eye className="mr-1 h-3 w-3" />
                          1.2k
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Learning Resources */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center text-lg font-semibold">
              <LuBookOpen className="mr-2 h-5 w-5 text-green-500" />
              Tài liệu học tập
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-gray-50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <LuFileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Hướng dẫn cơ bản về Dynamic Programming
                    </div>
                    <div className="text-sm text-gray-500">
                      Cập nhật 2 ngày trước
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Xem tất cả tài liệu
              </Button>
            </div>
          </Card>

          {/* Community Guidelines */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <h3 className="mb-4 flex items-center text-lg font-semibold">
              <LuShield className="mr-2 h-5 w-5 text-blue-500" />
              Nguyên tắc cộng đồng
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <RxCheckCircled className="mt-1 h-4 w-4 text-green-500" />
                <span>Tôn trọng và hỗ trợ thành viên khác</span>
              </li>
              <li className="flex items-start gap-2">
                <RxCheckCircled className="mt-1 h-4 w-4 text-green-500" />
                <span>Không spam hoặc đăng nội dung quảng cáo</span>
              </li>
              <li className="flex items-start gap-2">
                <RxCheckCircled className="mt-1 h-4 w-4 text-green-500" />
                <span>Chia sẻ kiến thức một cách rõ ràng</span>
              </li>
            </ul>
            <Button variant="link" className="mt-2 text-blue-600">
              Xem chi tiết
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
