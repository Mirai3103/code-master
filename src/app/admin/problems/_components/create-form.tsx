"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { type FancyMultiSelectOption } from "@/components/ui/fancy-multi-select";
import NovelEditor from "@/components/rich-editor";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type JSONContent } from "novel";
import { trpc } from "@/trpc/react";
import { toast } from "@/hooks/use-toast";

import { SelectTagInput } from "../_components/select-tag-input";
import {
  type CreateProblemDTO,
  createProblemSchema,
} from "@/server/schema/problem.schema";
import { DifficultyLevel } from "@/server/schema/enum";

// Types for form data including tags
interface ProblemFormData extends CreateProblemDTO {
  selectedTags: FancyMultiSelectOption[];
  newTags: FancyMultiSelectOption[];
  problemId?: string;
}

// Constants
const DEFAULT_VALUES: ProblemFormData = {
  title: "",
  difficultyLevel: DifficultyLevel.EASY,
  timeLimitInMs: 10,
  memoryLimitInKb: 256,
  isPublic: true,
  selectedTags: [],
  newTags: [],
  tags: [],
  problemStatement: {},
};

const DIFFICULTY_OPTIONS = [
  { value: "1", label: "Dễ" },
  { value: "2", label: "Trung bình" },
  { value: "3", label: "Khó" },
];

interface CreateFormProps {
  type?: "create" | "update";
  initialValues?: ProblemFormData;
}

export default function CreateForm({
  type = "create",
  initialValues = DEFAULT_VALUES,
}: CreateFormProps) {
  const { push } = useRouter();
  const utils = trpc.useUtils();

  // Form initialization
  const form = useForm<ProblemFormData>({
    resolver: zodResolver(createProblemSchema),
    defaultValues: initialValues,
  });

  // Mutations
  const { mutateAsync: createProblem } =
    trpc.problems.createProblem.useMutation({
      onSuccess: () => {
        utils.problems.getProblems.invalidate();
        push("/admin/problems");
        toast({
          title: "Bài toán đã được thêm thành công",
        });
      },
    });
  const { mutateAsync: updateProblem } =
    trpc.problems.updateProblem.useMutation({
      onSuccess: () => {
        utils.problems.getProblems.invalidate();
        push("/admin/problems");
        toast({
          title: "Bài toán đã được cập nhật thành công",
        });
      },
    });
  console.log("form", form.formState.errors);
  const onSubmit = async () => {
    const values = form.getValues();
    const payload = {
      memoryLimitInKb: values.memoryLimitInKb,
      timeLimitInMs: values.timeLimitInMs,
      difficultyLevel: values.difficultyLevel,
      isPublic: values.isPublic,
      title: values.title,
      description: values.description,
      problemStatement: values.problemStatement,
      tags: values.selectedTags.map((tag) => {
        return { tagId: tag.value, name: tag.label };
      }),
    };
    try {
      if (type === "update") {
        await updateProblem({
          problemId: initialValues.problemId!,
          ...payload,
        });
        return;
      }
      await createProblem(payload);
    } catch (error) {
      console.error(error);
      toast({
        title: "Có lỗi xảy ra",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="-mx-4 overflow-auto px-4 py-1 lg:space-x-12">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tiêu đề bài toán" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Problem Statement */}
          <FormField
            control={form.control}
            name="problemStatement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đề bài</FormLabel>
                <FormControl>
                  <NovelEditor
                    onChange={field.onChange}
                    content={field.value as unknown as JSONContent}
                    placeholder="Nhập đề bài (thường gồm đề bài, input, output, ví dụ, và giới hạn, ...)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <NovelEditor
                    onChange={field.onChange}
                    content={field.value as unknown as JSONContent}
                    placeholder="Nhập mô tả thêm cho bài toán (hướng dẫn, gợi ý, ...)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Problem Settings Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Difficulty Level */}
            <FormField
              control={form.control}
              name="difficultyLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Độ khó</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn độ khó" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DIFFICULTY_OPTIONS.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Limit */}
            <FormField
              control={form.control}
              name="timeLimitInMs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới hạn thời gian (giây)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Memory Limit */}
            <FormField
              control={form.control}
              name="memoryLimitInKb"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới hạn bộ nhớ (MB)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Tags */}
          <SelectTagInput form={form} />

          {/* Public Switch */}
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Công khai</FormLabel>
                  <FormDescription>
                    Bài toán này sẽ được hiển thị công khai cho tất cả người
                    dùng
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit">
            {type === "create" ? "Tạo bài toán" : "Lưu thay đổi"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
