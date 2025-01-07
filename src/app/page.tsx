import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  LuFileCode2 as Code2,
  LuBrain as Brain,
  LuTrophy as Trophy,
  LuUsers as Users,
  LuChevronRight as ChevronRight,
  LuGithub as Github,
} from "react-icons/lu";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl">
          Nâng cao kỹ năng lập trình của bạn
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
          Giải quyết các bài toán thuật toán, chuẩn bị cho phỏng vấn và học hỏi
          từ cộng đồng lập trình viên.
        </p>
        <div className="flex justify-center space-x-4">
          <Button className="bg-blue-600 px-8 text-lg text-white hover:bg-blue-700">
            Bắt đầu ngay
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="border-blue-600 px-8 text-lg text-blue-600 hover:bg-blue-50"
          >
            <Github className="mr-2 h-5 w-5" />
            GitHub Login
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
          Tại sao chọn CodeMaster?
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="bg-white shadow-lg transition-shadow hover:shadow-xl">
            <CardContent className="p-6">
              <Brain className="mb-4 h-12 w-12 text-blue-600" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                1500+ Bài tập
              </h3>
              <p className="text-gray-600">
                Đa dạng các bài tập từ cơ bản đến nâng cao, được phân loại theo
                chủ đề và độ khó.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg transition-shadow hover:shadow-xl">
            <CardContent className="p-6">
              <Trophy className="mb-4 h-12 w-12 text-blue-600" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Giải đấu hàng tuần
              </h3>
              <p className="text-gray-600">
                Tham gia các cuộc thi lập trình, thử thách bản thân và học hỏi
                từ người khác.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg transition-shadow hover:shadow-xl">
            <CardContent className="p-6">
              <Users className="mb-4 h-12 w-12 text-blue-600" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Cộng đồng
              </h3>
              <p className="text-gray-600">
                Kết nối với hàng nghìn lập trình viên, chia sẻ giải pháp và kinh
                nghiệm.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Problems Preview Section */}
      <section id="problems" className="container mx-auto px-4 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
          Các bài tập nổi bật
        </h2>
        <div className="space-y-4">
          {["Easy", "Medium", "Hard"].map((difficulty, index) => (
            <Card
              key={index}
              className="bg-white shadow transition-shadow hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Two Sum</h3>
                    <span
                      className={`text-sm ${
                        difficulty === "Easy"
                          ? "text-green-600"
                          : difficulty === "Medium"
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {difficulty}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Giải ngay
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Sẵn sàng để bắt đầu hành trình của bạn?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Tham gia cộng đồng của chúng tôi và bắt đầu nâng cao kỹ năng lập
            trình của bạn ngay hôm nay.
          </p>
          <Button className="bg-blue-600 px-8 text-lg text-white hover:bg-blue-700">
            Đăng ký miễn phí
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-gray-900">CodeMaster</span>
            </div>
            <div className="text-sm text-gray-600">
              © 2024 CodeMaster. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
