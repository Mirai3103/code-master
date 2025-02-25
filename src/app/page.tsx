import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  LuFileCode2 as Code2,
  LuBrain as Brain,
  LuUsers as Users,
  LuChevronRight as ChevronRight,
  LuTimer as Timer,
  LuGithub as Github,
} from "react-icons/lu";
import React from "react";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16">
        <nav className="mb-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CodePro</span>
          </div>
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
              asChild
            >
              <Link href="/problems">Bài tập</Link>
            </Button>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              Học Tập
            </Button>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              Thi Đấu
            </Button>
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              asChild
            >
              <Link href="/auth">Đăng Nhập</Link>
            </Button>
          </div>
        </nav>

        <div className="mx-auto max-w-4xl text-center">
          <h1 className="animate-fade-in mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-6xl font-bold text-transparent">
            Nâng Cao Kỹ Năng Lập Trình & Phỏng Vấn
          </h1>
          <p className="animate-slide-up mb-8 text-xl text-gray-600">
            Tham gia cộng đồng hàng triệu lập trình viên để cải thiện kỹ năng
            coding với các bài tập thực tế
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              className="bg-blue-600 px-8 py-6 text-lg text-white hover:bg-blue-700"
              asChild
            >
              <Link href={"/problems"}>
                Bắt Đầu Ngay <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 px-8 py-6 text-lg text-gray-700 hover:bg-gray-100"
            >
              <Github className="mr-2 h-5 w-5" />
              Đăng nhập với GitHub
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<Brain className="h-12 w-12 text-blue-600" />}
            title="2000+ Bài Tập"
            description="Luyện tập với đa dạng bài tập về thuật toán và cấu trúc dữ liệu, được chọn lọc kỹ từ các cuộc phỏng vấn thực tế."
          />
          <FeatureCard
            icon={<Timer className="h-12 w-12 text-purple-600" />}
            title="Code Trực Tuyến"
            description="Code và chạy thử nghiệm trực tiếp với IDE mạnh mẽ, hỗ trợ nhiều ngôn ngữ lập trình khác nhau."
          />
          <FeatureCard
            icon={<Users className="h-12 w-12 text-green-600" />}
            title="Cộng Đồng Sôi Nổi"
            description="Tham gia cộng đồng lập trình viên năng động để thảo luận giải pháp và học hỏi lẫn nhau."
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <StatCard number="2Tr+" label="Người Dùng" />
            <StatCard number="50N+" label="Người Dùng Mỗi Ngày" />
            <StatCard number="30+" label="Ngôn Ngữ Lập Trình" />
            <StatCard number="95%" label="Tỷ Lệ Phỏng Vấn Thành Công" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto mt-16 border-t border-gray-200 px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">CodePro</span>
          </div>
          <div className="text-sm text-gray-600">
            © 2025 CodePro. Đã đăng ký bản quyền.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Card className="border-gray-200 bg-white transition-all duration-300 hover:scale-105 hover:transform hover:border-blue-500 hover:shadow-lg">
    <CardContent className="p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

// Stat Card Component
const StatCard = ({ number, label }: { number: string; label: string }) => (
  <div className="rounded-lg bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
    <div className="mb-2 text-3xl font-bold text-blue-600">{number}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

export default LandingPage;
