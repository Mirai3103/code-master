"use client";

import NovelEditor from "@/components/rich-editor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { trpc } from "@/trpc/react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  LuCircleHelp as HelpCircle,
  LuLoader as Loader2,
} from "react-icons/lu";
import { useRouter } from "next/navigation";
import { type JSONContent } from "novel";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import {
  type NewTestCaseInput,
  newTestCaseSchema,
} from "@/server/schema/testcase.schema";
type FormType = Omit<
  z.infer<typeof newTestCaseSchema>,
  "explanation" | "createdAt" | "updatedAt"
> & {
  explanation?: unknown;
};

const DEFAULT_FORM_VALUES: FormType = {
  expectedOutput: "",
  inputData: "",
  isSample: false,
  points: 0,
  label: "",
  problemId: "",
  testCaseId: "",
};
interface Props {
  problem_id: string;
  type: "create" | "update";
  testcase?: FormType;
}

export default function TestcaseForm({ problem_id, type, testcase }: Props) {
  const isEdit = type === "update";
  const utils = trpc.useUtils();
  const { back, refresh } = useRouter();
  const form = useForm<FormType>({
    resolver: zodResolver(newTestCaseSchema),
    defaultValues: {
      ...DEFAULT_FORM_VALUES,
      ...(testcase || {}),
      problemId: problem_id,
    },
  });
  const { mutateAsync: createTestcaseAsync, isPending: isCreatingTestcase } =
    trpc.testcases.createTestcase.useMutation();
  const { mutateAsync: updateTestcaseAsync, isPending: isUpdatingTestcase } =
    trpc.testcases.updateTestcase.useMutation();

  const onSubmit = async (values: FormType) => {
    form.reset();
    const payload: NewTestCaseInput = {
      inputData: values.inputData,
      expectedOutput: values.expectedOutput,
      isSample: values.isSample,
      explanation: values.isSample
        ? (values.explanation as JSONContent)
        : undefined,
      label: values.label,
      points: values.points,
      problemId: problem_id,
      testCaseId: testcase!.testCaseId,
    };
    if (isEdit) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateTestcaseAsync(payload as any);
    } else {
      await createTestcaseAsync(payload);
    }
    utils.tags.getTags.invalidate();
    toast(isEdit ? "Testcase đã được cập nhật" : "Testcase đã được tạo");
    // onOpenChange(false);
    back();
    setTimeout(() => {
      refresh();
    }, 1000);
  };
  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        form.reset();
        back();
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="text-left">
          <DialogTitle>
            {isEdit ? "Cập nhật testcase" : "Tạo testcase mới"}
          </DialogTitle>

          <DialogDescription>
            Nhấn vào nút &quot;Lưu thay đổi&quot; để{" "}
            {isEdit ? "cập nhật" : "tạo mới"} testcase.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="-mr-4 max-h-[70vh] w-full py-1 pr-4">
          <Form {...form}>
            <form
              id="user-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 p-0.5"
            >
              <FormField
                control={form.control}
                name="label"
                render={({ field: { value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Tên testcase</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Tên để nhận biết testcase"
                        {...rest}
                        value={value ?? undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-x-2">
                <FormField
                  control={form.control}
                  name="points"
                  render={({ field: { value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Điểm</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Số điểm của testcase"
                          {...rest}
                          value={value ?? undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col justify-end">
                  <FormField
                    control={form.control}
                    name="isSample"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 py-1">
                        <div className="flex items-center space-x-2">
                          <FormLabel>Là testcase mẫu</FormLabel>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  Nếu được bật, testcase này sẽ không còn bị ẩn.
                                  Thông thường, nên đặt 1 hoặc 2 testcase là mẫu
                                  để người dùng hiểu và giúp người dùng dễ dàng
                                  gỡ lỗi mã của họ hơn.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
                </div>
              </div>

              <FormField
                control={form.control}
                name="inputData"
                render={({ field: { value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Dữ liệu đầu vào(stdin)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Dữ liệu đầu vào của testcase"
                        {...rest}
                        value={value ?? undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expectedOutput"
                render={({ field: { value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Dữ liệu đầu ra mong đợi(stdout)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Dữ liệu đầu ra mong đợi của testcase"
                        {...rest}
                        value={value ?? undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("isSample") && (
                <FormField
                  control={form.control}
                  name="explanation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giải thích testcase</FormLabel>
                      <FormControl>
                        <NovelEditor
                          onChange={field.onChange}
                          content={field.value as JSONContent}
                          placeholder="Nhập giải thích cho testcase"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button
            type="submit"
            form="user-form"
            disabled={isCreatingTestcase || isUpdatingTestcase}
          >
            {(isUpdatingTestcase || isCreatingTestcase) && (
              <Loader2 className="animate-spin" />
            )}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
