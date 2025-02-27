"use client";
import React, { useState } from "react";
import {
  LuCode as Code2,
  LuBook as Book,
  LuTrophy as Trophy,
  LuUsers as Users,
  LuBell as Bell,
  LuMenu as Menu,
  LuX as X,
  LuHouse as LuHome,
} from "react-icons/lu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "../_lib/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";
const NAVIGATION = [
  { name: "Trang Chủ", icon: LuHome, href: "/problems", current: true },
  { name: "Khóa Học", icon: Book, href: "/courses", current: false },
  { name: "Thi Đấu", icon: Trophy, href: "/contests", current: false },
  { name: "Cộng Đồng", icon: Users, href: "/community", current: false },
];
const userNavigation = [
  { name: "Hồ Sơ", href: "/profile" },
  { name: "Cài Đặt", href: "/settings" },
  { name: "Trợ Giúp", href: "/help" },
  { name: "Đăng Xuất", href: "/logout" },
];
// /problems/a94e8c8e-69e3-4ada-92a7-22bfc159e9b3
const EXCEPT_PATHS = [/^\/problems\/[a-f0-9-]+$/];
const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = React.useMemo(() => {
    return NAVIGATION.map((item) => ({
      ...item,
      current: pathname.startsWith(item.href),
    }));
  }, [pathname]);
  const isExceptPath = React.useMemo(() => {
    return EXCEPT_PATHS.some((path) => path.test(pathname));
  }, [pathname]);
  const { data: session } = useSession();

  const UserAvatar = () => (
    <div className="flex items-center gap-2">
      <img
        className="h-8 w-8 rounded-full"
        src={session?.user.image || "https://placewaifu.com/image/200/200"}
        alt="User avatar"
      />
      <div className="hidden md:block">
        <div className="text-sm font-medium text-gray-900">
          {session?.user?.name}
        </div>
        {/* <div className="text-xs text-gray-500">200 Points</div> */}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-xs">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-header items-center justify-between">
            {/* Left section - Logo and Navigation */}
            <div className="flex flex-1 items-center">
              <div className="flex shrink-0 items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
                <Link href={"/"} className="flex items-center">
                  <Code2 className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">
                    CodePro
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="ml-8 hidden space-x-1 md:flex">
                {navigation.map((item) => (
                  <Button
                    key={item.name}
                    variant={item.current ? "secondary" : "ghost"}
                    className="flex items-center"
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-600"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>

              {/* Progress Stats */}
              {/* <div className="mx-2 hidden items-center gap-4 rounded-full bg-gray-50 px-4 py-1 lg:flex">
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Rank 1234</span>
                </div>
                <div className="flex items-center gap-1">
                  <LuGraduationCap className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">127 đã giải</span>
                </div>
              </div> */}

              {/* User Menu */}
              <Select>
                <SelectTrigger className="w-fit min-w-[180px] border-none">
                  <UserAvatar />
                </SelectTrigger>
                <SelectContent align="end" className="w-[200px]">
                  {userNavigation.map((item) => (
                    <SelectItem key={item.name} value={item.href}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Search bar for mobile */}
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pb-4 pt-5">
            <nav className="mt-5 space-y-1 px-2">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant={item.current ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "mx-auto h-content-screen",
          !isExceptPath && "max-w-8xl px-4 py-2 sm:px-6 lg:px-8",
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
