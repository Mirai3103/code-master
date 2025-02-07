/* eslint-disable @typescript-eslint/no-explicit-any */
import { trpc } from "@/trpc/server";
import CrudTestcase from "./_components/crud-testcase";
import { Button } from "@/components/ui/button";
import {
  TbFileTypeZip as IconFileTypeZip,
  TbTestPipe as IconTestPipe,
} from "react-icons/tb";
import Link from "next/link";

export default async function ProblemTestcasesPage({
  params,
}: {
  params: Promise<{ problem_id: string }>;
}) {
  const problemId = (await params).problem_id;
  const testcase = await trpc.testcases.getTestcases({
    problemId,
    withAllTestcases: true,
  });
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between py-2">
          <p className="text-muted-foreground">
            Thêm các trường hợp kiểm thử để đánh giá tính đúng đắn của bài nộp
            của người dùng.
            <br /> Tải xuống các trường hợp kiểm thử mẫu từ thử thách Hello
            World để hiểu định dạng tệp .zip.
          </p>
          <div className="flex gap-x-2">
            <Button className="space-x-1" variant={"ghost"} asChild>
              <Link
                href={`/admin/problems/${problemId}/testcases-from-zip/add`}
              >
                <span>Tải file zip</span> <IconFileTypeZip size={18} />
              </Link>
            </Button>
            <Button className="space-x-1" asChild>
              <Link href={`/admin/problems/${problemId}/testcases/add`}>
                <span>Thêm testcase</span> <IconTestPipe size={18} />
              </Link>
            </Button>
          </div>
        </div>
        <CrudTestcase testcases={testcase as any} />
      </div>
    </div>
  );
}
