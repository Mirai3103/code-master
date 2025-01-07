import { LuCode as Code2 } from "react-icons/lu";
import Link from "next/link";
import { auth } from "@/server/auth";
import UserMenu from "./user-menu";

export default async function Header() {
  const session = await auth();
  return (
    <nav className="container mx-auto border-b p-2 px-6">
      <div className="flex items-center justify-between">
        <Link className="flex items-center space-x-2" href="/">
          <Code2 className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">CodeMaster</span>
        </Link>
        <div className="hidden space-x-6 md:flex">
          <a href="#features" className="text-gray-600 hover:text-blue-600">
            Tính năng
          </a>
          <Link href="/problems" className="text-gray-600 hover:text-blue-600">
            Bài tập
          </Link>
          <a href="#pricing" className="text-gray-600 hover:text-blue-600">
            Giá cả
          </a>
        </div>
        <div className="flex space-x-4">
          <UserMenu session={session} />
        </div>
      </div>
    </nav>
  );
}
