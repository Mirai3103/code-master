import {
  LuFileCode2 as Code2,
  LuSettings as SettingsIcon,
} from "react-icons/lu";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="container mx-auto border-b px-4 py-1">
      <div className="flex items-center justify-between">
        <Link className="flex items-center space-x-2" href="/">
          <Code2 className="h-6 w-6 text-blue-600" />
        </Link>
        <div className="hidden space-x-6 md:flex">
          <a href="#problems" className="text-gray-600 hover:text-blue-600">
            Bài tập
          </a>
        </div>
        <div>
          <SettingsIcon className="h-5 w-5 text-gray-600" />
        </div>
      </div>
    </nav>
  );
}
