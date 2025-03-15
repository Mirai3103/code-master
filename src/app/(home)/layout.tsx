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

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "../_lib/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";
import UserMenu from "../_components/user-menu";
const NAVIGATION = [
  { name: "Trang Chủ", icon: LuHome, href: "/problems", current: true },
  { name: "Khóa Học", icon: Book, href: "/courses", current: false },
  { name: "Thi Đấu", icon: Trophy, href: "/contests", current: false },
  { name: "Cộng Đồng", icon: Users, href: "/community", current: false },
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-xs">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-header flex items-center justify-between">
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
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
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
              <UserMenu session={session} />
            </div>
          </div>
        </div>

        {/* Search bar for mobile */}
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="bg-opacity-75 fixed inset-0 bg-gray-600"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
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
          "h-content-screen mx-auto",
          !isExceptPath && "max-w-8xl px-4 py-2 sm:px-6 lg:px-8",
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
