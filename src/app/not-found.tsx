import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  LuHouse as Home,
  LuSearch as Search,
  LuCode as Code,
  LuBug as Bug,
} from "react-icons/lu";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-blue-50 to-white px-4 py-12 text-center">
      {/* Fun Animation */}
      <div className="mb-8 flex items-center justify-center">
        <div className="relative">
          <Bug className="h-16 w-16 animate-bounce text-blue-500" />
          <Code className="absolute -right-4 top-0 h-8 w-8 rotate-12 text-blue-600" />
          <div className="absolute -left-3 bottom-0 h-8 w-8 animate-ping rounded-full bg-red-100"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md">
        <h1 className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-6xl font-bold text-transparent">
          404
        </h1>
        <p className="mt-4 text-2xl font-semibold text-gray-900">
          Oops! Trang không tồn tại
        </p>
        <p className="mt-2 text-gray-600">
          Có vẻ như bạn đang cố truy cập một trang không tồn tại hoặc đã bị xóa.
          Đừng lo, hãy thử một trong những cách sau:
        </p>

        {/* Suggestions */}
        <div className="mt-8 space-y-4">
          <Button className="w-full gap-2" asChild>
            <Link href={"/"}>
              <Home className="h-4 w-4" />
              Quay về trang chủ
            </Link>
          </Button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="search"
              placeholder="Tìm kiếm bài tập..."
              className="w-full rounded-md border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8">
          <p className="mb-4 text-sm text-gray-600">Hoặc truy cập nhanh:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/problems"> Bài tập</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={"/contests"}>Thi đấu</Link>
            </Button>
            <Button variant="outline" size="sm">
              <Link href={"/community"}>Cộng đồng</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Fun Facts */}
      <div className="mt-12 max-w-sm rounded-lg bg-blue-50 p-4 text-sm text-gray-600">
        <p className="font-medium text-blue-900">Bạn có biết?</p>
        <p className="mt-1">
          Thuật ngữ "404 Not Found" bắt nguồn từ phòng 404 tại trung tâm nghiên
          cứu của CERN, nơi đặt máy chủ web đầu tiên!
        </p>
      </div>

      {/* Support */}
      <div className="mt-8 text-sm text-gray-500">
        <p>
          Cần giúp đỡ?{" "}
          <Button variant="link" className="h-auto p-0 text-sm font-normal">
            Liên hệ hỗ trợ
          </Button>
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
