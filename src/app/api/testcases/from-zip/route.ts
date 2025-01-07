import { db } from "@/server/db";
import { TestcaseService } from "@/server/service/testcase.service";
import { type NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const problemId = formData.get("problemId")?.toString();
  const testcaseService = new TestcaseService(db);
  await testcaseService.uploadTestcasesFromZip(problemId!, file);
  return NextResponse.json({ success: true });
}
