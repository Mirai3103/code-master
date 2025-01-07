import { Header } from "@/components/layout/header";
import CreateForm from "../_components/create-form";
import { Search } from "@/components/search";
import { Main } from "@/components/layout/main";
import { Button } from "@/components/ui/button";
import { TbArrowLeft as IconArrowLeft } from "react-icons/tb";
import Link from "next/link";

export default function NewProblem() {
  return (
    <div>
      <Header sticky>
        <Search />
        <div className="ml-auto flex items-center space-x-4" />
      </Header>

      <Main>
        {/* Header Section */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Thêm bài toán mới
            </h2>
            <p className="text-muted-foreground">
              Thêm bài toán mới vào hệ thống
            </p>
          </div>
          <Button asChild variant="outline" className="space-x-2">
            <Link href="/admin/problems">
              <IconArrowLeft size={18} />
              <span>Quay lại</span>
            </Link>
          </Button>
        </div>
        {/* Form Section */}
        <CreateForm />
      </Main>
    </div>
  );
}
