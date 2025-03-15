import { Session } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { Button } from "./ui/button";
interface UserMenuProps {
  session?: Session | null;
}
const userNavigation = [
  { name: "Hồ Sơ", href: "/profile" },
  { name: "Cài Đặt", href: "/settings" },
  { name: "Trợ Giúp", href: "/help" },
  { name: "Đăng Xuất", href: "/auth/logout" },
];
export default function UserMenu({ session }: UserMenuProps) {
  if (!session?.user.id)
    return (
      <Button
        variant="outline"
        className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
        asChild
      >
        <Link href="/auth">Đăng Nhập</Link>
      </Button>
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-fit min-w-[180px] border-none">
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
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {userNavigation.map((item) => (
          <DropdownMenuItem
            key={item.name}
            asChild
            className="cursor-pointer hover:bg-gray-100"
          >
            <Link href={item.href}>{item.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
