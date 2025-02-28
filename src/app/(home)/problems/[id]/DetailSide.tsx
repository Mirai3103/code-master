"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LuThumbsUp as ThumbsUp,
  LuFlag as Flag,
  LuBookmark as Bookmark,
  LuShare2 as Share,
  LuFileText as FileText,
  LuMessageSquare as Message,
  LuTag as Tag,
  LuZap as Zap,
  LuActivity as Activity,
  LuHistory,
} from "react-icons/lu";
import { ResizablePanel } from "@/app/_components/ui/resizable";
import { Problem } from "@prisma/client";
import { getDifficultyText } from "../utils";
import React from "react";
import { useIsClient } from "usehooks-ts";
import { generateHTML } from "@tiptap/core";
import { StarterKit } from "novel";
import { Tag as ITag } from "@/server/schema/tag.schema";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import SubmissionProgressTab from "./_components/SubmissionTab";
import SubmissionsTable from "./_components/SubmissionTable";
interface Props {
  problem: Problem & {
    problemTags: Partial<ITag & { tag: { tagName: string } }>[];
  };
}

export default function DetailSide({ problem }: Props) {
  const [html, setHtml] = React.useState("");
  const isClient = useIsClient();
  React.useEffect(() => {
    if (isClient) {
      setHtml(generateHTML(problem!.problemStatement as never, [StarterKit]));
    }
  }, [isClient, problem]);
  return (
    <ResizablePanel defaultSize={50} collapsible minSize={30}>
      <ScrollArea className="scroll-area h-full border-r border-gray-200 bg-white">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">{problem.title}</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bookmark className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
              {getDifficultyText(problem.difficultyLevel)}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <ThumbsUp className="h-4 w-4" />
              {100}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <Activity className="h-4 w-4" />
              100 chấp nhận
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <Flag className="h-4 w-4" />
              2000 bài nộp
            </span>
          </div>
        </div>

        <div className="px-6 py-4">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                Mô tả
              </TabsTrigger>
              <TabsTrigger value="hints" className="flex-1">
                <Zap className="mr-2 h-4 w-4" />
                Gợi ý
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1">
                <LuHistory className="mr-2 h-4 w-4" />
                Lịch sử bài nộp
              </TabsTrigger>
              <TabsTrigger value="discussions" className="flex-1">
                <Message className="mr-2 h-4 w-4" />
                Thảo luận
              </TabsTrigger>
              <TabsTrigger value="submission" className="flex-1">
                <Activity className="mr-2 h-4 w-4" />
                Bài nộp
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: html,
                  }}
                  className=""
                />
                <div className="mt-6">
                  <h3 className="mb-2 text-lg font-semibold">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {problem.problemTags.map((tag) => (
                      <span
                        key={tag.tagId}
                        className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                      >
                        <Tag className="h-3 w-3" />
                        {tag.tag?.tagName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="history">
              <SubmissionsTable problemId={problem.problemId!} />
            </TabsContent>
            <TabsContent value="submission">
              <SubmissionProgressTab />
            </TabsContent>
            <TabsContent value="hints">
              <Card className="p-4">
                <h3 className="mb-4 text-lg font-semibold">Gợi ý giải bài</h3>
                <div className="space-y-4">
                  <div className="rounded-lg bg-yellow-50 p-4">
                    <p className="text-yellow-800">
                      1. Thử nghĩ về cách sử dụng hash table để tối ưu thời gian
                      tìm kiếm
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Xem thêm gợi ý
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
      {/* <div className=" overflow-y-auto ">
      
      </div> */}
    </ResizablePanel>
  );
}
