"use client";
import React, { useState } from "react";
import {
  LuCode as Code2,
  LuBook as Book,
  LuTrophy as Trophy,
  LuUsers as Users,
  LuBell as Bell,
  LuSearch as Search,
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
import { Input } from "@/components/ui/input";
const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Trang Chủ", icon: LuHome, href: "/", current: true },
    { name: "Bài Tập", icon: Code2, href: "/problems", current: false },
    { name: "Khóa Học", icon: Book, href: "/courses", current: false },
    { name: "Thi Đấu", icon: Trophy, href: "/contest", current: false },
    { name: "Cộng Đồng", icon: Users, href: "/community", current: false },
  ];

  const userNavigation = [
    { name: "Hồ Sơ", href: "/profile" },
    { name: "Cài Đặt", href: "/settings" },
    { name: "Trợ Giúp", href: "/help" },
    { name: "Đăng Xuất", href: "/logout" },
  ];

  const UserAvatar = () => (
    <div className="flex items-center gap-2">
      <img
        className="h-8 w-8 rounded-full"
        src="/api/placeholder/32/32"
        alt="User avatar"
      />
      <div className="hidden md:block">
        <div className="text-sm font-medium text-gray-900">Trần Văn A</div>
        <div className="text-xs text-gray-500">200 Points</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left section - Logo and Navigation */}
            <div className="flex flex-1 items-center">
              <div className="flex flex-shrink-0 items-center">
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
                <Code2 className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  CodePro
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="ml-8 hidden space-x-1 md:flex">
                {navigation.map((item) => (
                  <Button
                    key={item.name}
                    variant={item.current ? "secondary" : "ghost"}
                    className="flex items-center"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Center section - Search */}
            <div className="mx-4 hidden max-w-lg flex-1 lg:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm bài tập..."
                  className="w-full bg-gray-50 pl-10"
                />
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
        <div className="px-4 pb-3 lg:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm bài tập..."
              className="w-full bg-gray-50 pl-10"
            />
          </div>
        </div>
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
      <main className="max-w-8xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
