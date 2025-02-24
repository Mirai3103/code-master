"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LuHouse as Home,
  LuRefreshCcw as Refresh,
  LuCircleAlert as AlertCircle,
  LuCircleX as XCircle,
  LuWifiOff as WifiOff,
  LuServer as Server,
  LuShieldOff as ShieldOff,
} from "react-icons/lu";

interface ErrorPageProps {
  code?: number;
  title?: string;
  message?: string;
}

const ErrorPage = ({
  code = 500,
  title = "Đã xảy ra lỗi",
  message = "Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau.",
}: ErrorPageProps) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const getErrorIcon = () => {
    switch (code) {
      case 403:
        return <ShieldOff className="h-16 w-16 text-orange-500" />;
      case 500:
        return <Server className="h-16 w-16 text-red-500" />;
      case 503:
        return <Server className="h-16 w-16 text-purple-500" />;
      case 444:
        return <WifiOff className="h-16 w-16 text-blue-500" />;
      default:
        return <XCircle className="h-16 w-16 text-red-500" />;
    }
  };

  const getErrorDetails = () => {
    switch (code) {
      case 403:
        return {
          title: "Truy cập bị từ chối",
          message: "Bạn không có quyền truy cập trang này.",
          suggestion: "Vui lòng đăng nhập hoặc liên hệ admin để được hỗ trợ.",
        };
      case 500:
        return {
          title: "Lỗi máy chủ",
          message: "Rất tiếc, máy chủ đang gặp sự cố.",
          suggestion: "Vui lòng thử lại sau vài phút.",
        };
      case 503:
        return {
          title: "Dịch vụ không khả dụng",
          message: "Hệ thống đang được bảo trì.",
          suggestion: "Vui lòng quay lại sau.",
        };
      case 444:
        return {
          title: "Lỗi kết nối",
          message: "Không thể kết nối đến máy chủ.",
          suggestion: "Vui lòng kiểm tra kết nối internet của bạn.",
        };
      default:
        return {
          title,
          message,
          suggestion: "Vui lòng thử lại hoặc liên hệ hỗ trợ nếu lỗi tiếp tục.",
        };
    }
  };

  const handleRetry = () => {
    setIsRetrying(true);
    setRetryCount((prev) => prev + 1);

    // Giả lập retry
    setTimeout(() => {
      setIsRetrying(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="w-full max-w-md text-center">
        {/* Error Icon with Animation */}
        <div className="relative mx-auto mb-8 w-fit">
          {getErrorIcon()}
          <div className="absolute -right-2 top-0 h-4 w-4 animate-ping rounded-full bg-red-100"></div>
        </div>

        {/* Error Code */}
        <div className="mb-4 text-6xl font-bold text-gray-900">{code}</div>

        {/* Error Details */}
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h1 className="mb-2 text-xl font-semibold text-gray-900">
            {getErrorDetails().title}
          </h1>
          <p className="mb-4 text-gray-600">{getErrorDetails().message}</p>
          <p className="text-sm text-gray-500">
            {getErrorDetails().suggestion}
          </p>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <Button
              onClick={handleRetry}
              className="relative w-full gap-2"
              disabled={isRetrying}
            >
              <Refresh
                className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
              />
              {isRetrying ? "Đang thử lại..." : "Thử lại"}
              {retryCount > 0 && (
                <span className="absolute right-2 top-1 rounded-full bg-red-100 px-1.5 py-0.5 text-xs text-red-600">
                  {retryCount}
                </span>
              )}
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <Home className="h-4 w-4" />
              Về trang chủ
            </Button>
          </div>

          {/* Error Report Section */}
          {code === 500 && (
            <div className="mt-6 rounded-lg bg-gray-50 p-4 text-left">
              <p className="mb-2 text-sm font-medium text-gray-900">
                Chi tiết lỗi cho đội kỹ thuật:
              </p>
              <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs text-gray-600">
                Error ID: {Math.random().toString(36).substr(2, 9)}
                Timestamp: {new Date().toISOString()}
                Path: /api/something Type: Internal Server Error
              </pre>
              <Button
                variant="link"
                className="mt-2 h-auto p-0 text-xs text-blue-600"
              >
                Sao chép thông tin lỗi
              </Button>
            </div>
          )}
        </div>

        {/* Support Section */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
          <AlertCircle className="h-4 w-4" />
          <span>
            Cần giúp đỡ?{" "}
            <Button variant="link" className="h-auto p-0 text-sm font-normal">
              Liên hệ hỗ trợ
            </Button>
          </span>
        </div>
      </div>

      {/* Status Updates */}
      {code === 503 && (
        <div className="mt-8 w-full max-w-md rounded-lg border border-blue-100 bg-blue-50 p-4">
          <h3 className="mb-2 font-medium text-blue-900">
            Trạng thái hệ thống
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
              Đang bảo trì theo lịch (Dự kiến: 2 giờ)
            </p>
            <Button variant="link" className="h-auto p-0 text-xs text-blue-700">
              Xem chi tiết trạng thái
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorPage;
