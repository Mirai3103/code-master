"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LuCode as Code,
  LuMail as Mail,
  LuLock as Lock,
  LuUser as User,
  LuGithub as Github,
  LuEye as Eye,
  LuEyeOff as EyeOff,
} from "react-icons/lu";
import { redirect } from "next/navigation";
import { FcGoogle as Google } from "react-icons/fc";
import { useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const { data: session } = useSession();
  if (session) {
    redirect(redirectTo || "/problems");
  }
  const handleLogin = (
    provider: "google" | "facebook" | "discord" | "github",
  ) => {
    signIn(provider, {
      callbackUrl: redirectTo || "/problems",
    });
  };
  return (
    <div className="flex min-h-content-screen items-center justify-center bg-linear-to-b from-blue-50 to-white px-4 py-4">
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Code className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Chào mừng đến với CodePro
          </h1>
          <p className="mt-2 text-gray-600">
            Nền tảng luyện tập và thi đấu lập trình hàng đầu
          </p>
        </div>

        {/* Auth Card */}
        <Card className="border-gray-200 shadow-lg">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register">Đăng ký</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="p-6">
              {/* Login Form */}
              <TabsContent value="login">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-600">Ghi nhớ tôi</span>
                    </label>
                    <Button variant="link" className="text-sm">
                      Quên mật khẩu?
                    </Button>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </form>

                <div className="my-6 flex items-center">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="mx-4 text-sm text-gray-500">
                    Hoặc đăng nhập với
                  </span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleLogin("github")}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Github
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleLogin("google")}
                  >
                    <Google className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                </div>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Mật khẩu phải có ít nhất 8 ký tự
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      className="mt-1 rounded border-gray-300"
                      required
                    />
                    <span className="text-sm text-gray-600">
                      Tôi đồng ý với{" "}
                      <Button variant="link" className="h-auto p-0 text-sm">
                        điều khoản sử dụng
                      </Button>{" "}
                      và{" "}
                      <Button variant="link" className="h-auto p-0 text-sm">
                        chính sách bảo mật
                      </Button>
                    </span>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                  </Button>
                </form>

                <div className="my-6 flex items-center">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="mx-4 text-sm text-gray-500">
                    Hoặc đăng ký với
                  </span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    <Github className="mr-2 h-4 w-4" />
                    Github
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Google className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Bạn cần giúp đỡ?{" "}
            <Button variant="link" className="h-auto p-0">
              Liên hệ hỗ trợ
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
