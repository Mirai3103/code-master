"use client";
import { type Session } from "next-auth";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LuLogOut as LogOut, LuSettings as Settings } from "react-icons/lu";
import { TbCloudUp, TbLayoutDashboard } from "react-icons/tb";
import { signOut } from "next-auth/react";
function logout(...args: unknown[]) {
  signOut();
}
interface Props {
  session: Session | null | undefined;
}
export default function UserMenu({ session }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  if (!session)
    return (
      <>
        <Button
          asChild
          variant="outline"
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <Link href="/login">Đăng nhập</Link>
        </Button>
        <Button className="bg-blue-600 text-white hover:bg-blue-700" asChild>
          <Link href="/register">Đăng ký miễn phí</Link>
        </Button>
      </>
    );
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image!} alt={session.user.name!} />
            <AvatarFallback>
              {session.user.name!.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex items-center gap-4 p-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={session.user.image!} alt={session.user.name!} />
            <AvatarFallback>L</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">{session.user.name}</h2>
            <p className="text-sm text-orange-500">
              Access all features with our Premium subscription!
            </p>
          </div>
        </div>

        {/* <div className="grid grid-cols-3 gap-2 p-4">
					<Card className="p-4 flex flex-col items-center gap-2 hover:bg-accent cursor-pointer">
						<LuListTodo className="h-6 w-6 text-primary" />
						<span className="text-sm">My Lists</span>
					</Card>
					<Card className="p-4 flex flex-col items-center gap-2 hover:bg-accent cursor-pointer">
						<LuBook className="h-6 w-6 text-primary" />
						<span className="text-sm">Notebook</span>
					</Card>
					<Card className="p-4 flex flex-col items-center gap-2 hover:bg-accent cursor-pointer">
						<TbHelpCircle className="h-6 w-6 text-primary" />
						<span className="text-sm">Submissions</span>
					</Card>
					<Card className="p-4 flex flex-col items-center gap-2 hover:bg-accent cursor-pointer">
						<LuClock className="h-6 w-6 text-green-500" />
						<span className="text-sm">Progress</span>
					</Card>
					<Card className="p-4 flex flex-col items-center gap-2 hover:bg-accent cursor-pointer">
						<LuCoins className="h-6 w-6 text-yellow-500" />
						<span className="text-sm">Points</span>
					</Card>
				</div> */}

        <DropdownMenuSeparator />

        <div className="p-2">
          <DropdownMenuItem asChild>
            <Link href="/playground" className="flex items-center gap-2 py-2">
              <TbCloudUp className="h-4 w-4" />
              <span>Bài nộp</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-2 py-2">
              <Settings className="h-4 w-4" />
              <span>Cài đặt tài khoản</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/orders" className="flex items-center gap-2 py-2">
              <TbLayoutDashboard className="h-4 w-4" />
              <span>Quản lý</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={logout}
            className="flex items-center gap-2 py-2 text-red-600 focus:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
