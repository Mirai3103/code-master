"use client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateHTML } from "@tiptap/core";
import { StarterKit } from "novel";
import React from "react";
import { type ProblemDetail } from "./type";
import { Badge } from "@/components/ui/badge";
import { useIsClient } from "usehooks-ts";
import { trpc } from "@/trpc/react";
import { useProblemEditorContext } from "../../../(home)/problems/[id]/context";
import { Progress } from "@/components/ui/progress";
import {
  SubmissionStatus,
  SubmissionTestcaseStatus,
} from "@/server/schema/enum";
import TestcaseRunner from "./testcase";
interface Props {
  problem: ProblemDetail;
}
export default function DescriptionSide({ problem }: Props) {
  const [html, setHtml] = React.useState("");
  const isClient = useIsClient();
  React.useEffect(() => {
    if (isClient) {
      setHtml(generateHTML(problem!.problemStatement as never, [StarterKit]));
    }
  }, [isClient, problem]);
  const { isShowSubmitTab, submissionStatus, tabValue, setTabValue } =
    useProblemEditorContext();
  return (
    <div className="flex w-1/2 flex-col border-r border-gray-200">
      <Card className="flex-1 overflow-hidden">
        <Tabs
          value={tabValue}
          onValueChange={setTabValue}
          className="flex h-full flex-col"
        >
          <TabsList className="justify-start bg-gray-100 py-0">
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="solution">Giải pháp</TabsTrigger>
            <TabsTrigger value="submissions">Bài nộp</TabsTrigger>
            <TabsTrigger value="discussions">Thảo luận</TabsTrigger>
            {isShowSubmitTab && (
              <TabsTrigger value="submit">
                {SubmissionStatusDisplay[submissionStatus]}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent
            value="description"
            className="flex-1 overflow-auto p-4 py-2"
          >
            <ScrollArea className="prose prose-sm prose-blue h-full max-w-none">
              <h1 style={{ marginBottom: "2px" }}>{problem!.title}</h1>
              {problem?.problemTags.map((tag) => (
                <Badge
                  key={tag.tagId}
                  variant="secondary"
                  className="cursor-pointer hover:bg-gray-200"
                >
                  {tag.tag.tagName}
                </Badge>
              ))}
              <div
                dangerouslySetInnerHTML={{
                  __html: html,
                }}
                className=""
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="solution" className="flex-1 overflow-auto p-4">
            <div className="prose prose-blue max-w-none">
              <h2>Hướng dẫn giải</h2>
              <p>Có nhiều cách tiếp cận bài toán này...</p>
            </div>
          </TabsContent>
          <TabsContent value="submit" className="flex-1 overflow-auto p-4">
            <SubmittingTab problemId={problem!.problemId} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

interface ISubmittingTabProps {
  problemId: string;
}

function SubmittingTab({ problemId }: ISubmittingTabProps) {
  const {
    testcases,
    setTestcases,
    isShowSubmitTab,
    submissionStatus,
    submissionId,
  } = useProblemEditorContext();

  const { data } = trpc.testcases.getAllTestcasesForSubmitting.useQuery({
    problemId,
  });
  React.useEffect(() => {
    if (data) {
      setTestcases(
        data.map((testcase) => ({
          ...testcase,
          status: SubmissionTestcaseStatus.RUNNING,
          problemId,
        })) as never,
      );
    }
  }, [data, setTestcases]);
  const completedTestcases = React.useMemo(() => {
    return (
      testcases?.filter(
        (test) => test.status !== SubmissionTestcaseStatus.RUNNING,
      ).length || 0
    );
  }, [testcases]);
  const process = (completedTestcases / (testcases?.length || 1)) * 100;
  const { data: submission, isLoading } =
    trpc.submissions.getSubmissionById.useQuery(problemId, {
      enabled: !!submissionId,
    });

  if (!isShowSubmitTab) {
    return null;
  }
  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
      <div className="">
        <h2 className="mb-2 text-2xl font-bold">Trạng thái bài nộp của bạn</h2>
        <Badge
          variant={
            SubmissionStatusVariant[
              (submission?.status as SubmissionStatus) || submissionStatus
            ] as any
          }
        >
          {SubmissionStatusDisplay[
            (submission?.status as SubmissionStatus) || submissionStatus
          ] || "Unknown"}
        </Badge>
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold">Tiến trình chạy</h3>
        <Progress value={process} className="w-full" />
        <p className="mt-2 text-sm text-gray-600">
          {completedTestcases} trên {testcases?.length} testcases đã chạy
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Testcases</h3>
        {testcases?.map((test, index) => (
          <TestcaseRunner
            key={index}
            actualOutput={test.actualOutput || ""}
            status={test.status}
            testcase={test as never}
          />
        ))}
      </div>
      <h3 className="text-lg font-semibold">Thống kê</h3>
      <div className="rounded bg-gray-100 p-4">
        <p>Thời gian chạy trung bình: 200 ms</p>
        <p>Nhanh hơn 85% các bài nộp khác</p>
        <div className="mt-2">
          <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2.5 rounded-full bg-blue-600"
              style={{ width: "85%" }}
            ></div>
          </div>
        </div>
      </div>
      <div className="rounded bg-gray-100 p-4">
        <p>Bộ nhớ sử dụng trung bình: 2 MB</p>
        <p>Ít hơn 92% các bài nộp khác</p>
        <div className="mt-2">
          <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2.5 rounded-full bg-green-600"
              style={{ width: "92%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SubmissionStatusDisplay = {
  [SubmissionStatus.ACCEPTED]: "Chấp nhận",
  [SubmissionStatus.COMPILE_ERROR]: "Lỗi biên dịch",
  [SubmissionStatus.RUNTIME_ERROR]: "Lỗi thời gian chạy",
  [SubmissionStatus.DRAFT]: "Nháp",
  [SubmissionStatus.MEMORY_LIMIT_EXCEEDED]: "Vượt quá giới hạn bộ nhớ",
  [SubmissionStatus.PENDING]: "Đang chờ",
  [SubmissionStatus.WRONG_ANSWER]: "Sai kết quả",
  [SubmissionStatus.TIME_LIMIT_EXCEEDED]: "Vượt quá giới hạn thời gian",
};

const SubmissionStatusVariant = {
  [SubmissionStatus.ACCEPTED]: "default",
  [SubmissionStatus.COMPILE_ERROR]: "danger",
  [SubmissionStatus.RUNTIME_ERROR]: "danger",
  [SubmissionStatus.DRAFT]: "secondary",
  [SubmissionStatus.MEMORY_LIMIT_EXCEEDED]: "danger",
  [SubmissionStatus.PENDING]: "secondary",
  [SubmissionStatus.WRONG_ANSWER]: "danger",
  [SubmissionStatus.TIME_LIMIT_EXCEEDED]: "danger",
};
