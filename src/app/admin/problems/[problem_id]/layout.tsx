"use client";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Search } from "@/components/search";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TbArrowLeft as IconArrowLeft } from "react-icons/tb";
import React from "react";
import { TestcaseProvider } from "./@testcases/_components/context";
interface ProblemDetailLayoutProps {
  children: React.ReactNode;
  testcases: React.ReactNode;
  languages: React.ReactNode;
  modal: React.ReactNode;
}

export default function Layout({
  children,
  testcases,
  languages,
  modal,
}: ProblemDetailLayoutProps) {
  return (
    <TestcaseProvider>
      <div>
        {modal}
        <Header sticky>
          <Search />
          <div className="ml-auto flex items-center space-x-4" />
        </Header>

        <Main>
          {/* Header Section */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Chỉnh sửa bài toán
              </h2>
              <p className="text-muted-foreground">
                Sửa đổi thông tin của bài toán, quản lý testcases, ngôn ngữ, ...
              </p>
            </div>
            <Button variant="outline" className="space-x-2">
              <IconArrowLeft size={18} />
              <span>Quay lại</span>
            </Button>
          </div>
          <Tabs defaultValue="problems" className="">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="problems">Bài toán</TabsTrigger>
              <TabsTrigger value="testcases">Testcase</TabsTrigger>
              <TabsTrigger value="languages">Ngôn ngữ</TabsTrigger>
              <TabsTrigger value="hint">Hướng dẫn</TabsTrigger>
            </TabsList>
            <TabsContent value="problems">{children}</TabsContent>
            <TabsContent value="testcases">{testcases}</TabsContent>
            <TabsContent value="languages">{languages}</TabsContent>
            <TabsContent value="hint">Hint</TabsContent>
          </Tabs>
        </Main>
      </div>
    </TestcaseProvider>
  );
}
