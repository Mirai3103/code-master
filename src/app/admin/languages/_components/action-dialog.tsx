import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Editor, useMonaco } from "@monaco-editor/react";
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

import { trpc } from "@/trpc/react";
import { LuLoader as Loader2 } from "react-icons/lu";
import { InputWithTooltip } from "@/components/InputWithTooltip";
import { AutoComplete } from "@/components/auto-complete";
import {
  type CreateLanguageDTO,
  createLanguageSchema,
  type Language,
} from "@/server/schema/language.schema";

interface Props {
  currentRow?: Language;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LanguagesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: Props) {
  const utils = trpc.useUtils();
  const monaco = useMonaco();
  const isEdit = !!currentRow;
  const form = useForm<CreateLanguageDTO>({
    resolver: zodResolver(createLanguageSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
        }
      : {
          monacoCodeLanguage: "plaintext",
        },
  });
  const { mutateAsync: createLanguageAsync, isPending: isCreatingLanguage } =
    trpc.languages.createLanguage.useMutation();
  const { mutateAsync: updateLanguageAsync, isPending: isUpdatingLanguage } =
    trpc.languages.updateLanguage.useMutation();

  const onSubmit = async (values: CreateLanguageDTO) => {
    form.reset();
    if (isEdit) {
      await updateLanguageAsync({
        languageId: currentRow.languageId,
        ...values,
      });
    } else {
      await createLanguageAsync(values);
    }
    utils.languages.getLanguages.invalidate();
    toast.success(
      isEdit ? "Ngôn ngữ đã được cập nhật" : "Ngôn ngữ đã được tạo",
    );
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader className="text-left">
          <DialogTitle>
            {isEdit ? "Cập nhật ngôn ngữ" : "Tạo ngôn ngữ mới"}
          </DialogTitle>

          <DialogDescription>
            Nhấn vào nút &quot;Lưu thay đổi&quot; để{" "}
            {isEdit ? "cập nhật" : "tạo mới"} ngôn ngữ.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="-mr-4 max-h-[80vh] w-full py-1 pr-4">
          <Form {...form}>
            <form
              id="user-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 p-0.5"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="languageName"
                  render={({ field: { value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Tên </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="C++"
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
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phiên bản</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="17" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sourceFileExt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phần mở rộng file mã nguồn</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder=".cpp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="binaryFileExt"
                  render={({ field: { value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Phần mở rộng file thực thi</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder=".out"
                          {...rest}
                          value={value ?? undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="compileCommand"
                render={({ field: { value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Lệnh biên dịch</FormLabel>
                    <FormControl>
                      <InputWithTooltip
                        popoverContent={
                          <span>
                            <code>$SourceFileName</code>
                            : Tên file mã nguồn
                            <br />
                            <code>$BinaryFileName</code>: Tên file thực thi
                          </span>
                        }
                        type="text"
                        placeholder="g++ $SourceFileName -o $BinaryFileName"
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
                name="runCommand"
                render={({ field: { value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Lệnh thực thi</FormLabel>
                    <FormControl>
                      <InputWithTooltip
                        type="text"
                        popoverContent={
                          <span>
                            <code>$SourceFileName</code>
                            : Tên file mã nguồn
                            <br />
                            <code>$BinaryFileName</code>: Tên file thực thi
                          </span>
                        }
                        placeholder="$BinaryFileName"
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
                name="monacoCodeLanguage"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Ngôn ngữ editor</FormLabel>
                    <FormControl>
                      <AutoComplete
                        selectedValue={field.value}
                        onSelectedValueChange={onChange}
                        items={
                          monaco?.languages.getLanguages().map((language) => ({
                            value: language.id,
                            label: `${language.id} - (${(language.aliases || []).join()})`,
                          })) ?? []
                        }
                        placeholder="Chọn ngôn ngữ"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="templateCode"
                render={({ field: { value, onChange, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Mã mẫu</FormLabel>
                    <FormControl>
                      <Editor
                        theme="vs-dark"
                        height="200px"
                        language={
                          form.watch("monacoCodeLanguage") ?? "plaintext"
                        }
                        defaultValue={currentRow?.templateCode}
                        value={value ?? undefined}
                        onChange={onChange}
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button
            type="submit"
            form="user-form"
            disabled={isCreatingLanguage || isUpdatingLanguage}
          >
            {(isUpdatingLanguage || isCreatingLanguage) && (
              <Loader2 className="animate-spin" />
            )}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
