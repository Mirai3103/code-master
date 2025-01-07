"use client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateHTML } from "@tiptap/core";
import { StarterKit } from "novel/extensions";
import React from "react";
import { type ProblemDetail } from "./type";
import { Badge } from "@/components/ui/badge";
import { useIsClient } from "usehooks-ts";
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
  return (
    <div className="flex w-1/2 flex-col border-r border-gray-200">
      <Card className="flex-1 overflow-hidden">
        <Tabs defaultValue="description" className="flex h-full flex-col">
          <TabsList className="justify-start bg-gray-100 py-0">
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="solution">Giải pháp</TabsTrigger>
            <TabsTrigger value="submissions">Bài nộp</TabsTrigger>
            <TabsTrigger value="discussions">Thảo luận</TabsTrigger>
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
        </Tabs>
      </Card>
    </div>
  );
}
