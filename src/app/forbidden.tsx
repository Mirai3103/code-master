import { Button } from "@/components/ui/button";
import {
  LuShieldOff as ShieldOff,
  LuLogIn as LogIn,
  LuHouse as Home,
  LuArrowLeft as ArrowLeft,
  LuMail as Mail,
  LuLock as Lock,
} from "react-icons/lu";

const ForbiddenPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-red-50 to-white p-4">
      <div className="w-full max-w-lg text-center">
        {/* Icon Animation */}
        <div className="relative mx-auto mb-8 w-fit">
          <div className="relative">
            <ShieldOff className="h-24 w-24 text-red-500" />
            <div className="absolute -right-2 top-0 h-4 w-4 animate-ping rounded-full bg-red-100"></div>
          </div>
          <Lock className="absolute -bottom-2 -right-2 h-8 w-8 text-gray-400" />
        </div>

        {/* Main Content */}
        <div className="rounded-xl bg-white p-8 shadow-xl">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            403 - Truy cập bị từ chối
          </h1>
          <p className="mb-6 text-gray-600">
            Bạn không có quyền truy cập trang này.
          </p>

          {/* Access Info */}
          <div className="mb-8 rounded-lg bg-red-50 p-4 text-left">
            <h2 className="mb-3 font-medium text-red-900">
              Có thể do một trong các nguyên nhân sau:
            </h2>
            <ul className="space-y-2 text-sm text-red-800">
              <li className="flex items-start gap-2">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500"></div>
                <span>Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500"></div>
                <span>
                  Tài khoản của bạn không có đủ quyền để truy cập trang này
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500"></div>
                <span>
                  URL bạn đang truy cập yêu cầu xác thực hoặc quyền đặc biệt
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full gap-2">
              <LogIn className="h-4 w-4" />
              Đăng nhập
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Home className="h-4 w-4" />
                Trang chủ
              </Button>
            </div>
          </div>

          {/* Support Section */}
          <div className="mt-8 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <h3 className="mb-3 text-sm font-medium text-gray-900">
              Bạn cho rằng đây là một lỗi?
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Nếu bạn tin rằng mình nên có quyền truy cập trang này, vui lòng
              liên hệ:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>support@codepro.vn</span>
              </div>
              <p className="text-xs text-gray-500">
                Vui lòng cung cấp ID tài khoản và URL bạn đang cố truy cập
              </p>
            </div>
          </div>
        </div>

        {/* Request Access Form */}
        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-left">
          <h3 className="mb-2 text-sm font-medium text-blue-900">
            Yêu cầu quyền truy cập
          </h3>
          <p className="mb-4 text-sm text-blue-700">
            Gửi yêu cầu truy cập tới quản trị viên của trang này
          </p>
          <Button
            variant="outline"
            className="w-full bg-white text-blue-700 hover:bg-blue-100"
          >
            Gửi yêu cầu
          </Button>
        </div>

        {/* Error Details (cho admin) */}
        <div className="mt-6 text-left">
          <Button
            variant="link"
            className="gap-2 p-0 text-xs text-gray-500 hover:text-gray-700"
          >
            Xem chi tiết lỗi
          </Button>
          <div className="mt-2 hidden">
            <pre className="rounded bg-gray-100 p-2 text-xs text-gray-600">
              Error Code: 403 Timestamp: {new Date().toISOString()}
              Path: /restricted/area User ID: user_123 IP: 192.168.1.1
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
