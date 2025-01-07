import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
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
import { Textarea } from "@/components/ui/textarea";
import { LuLoader as Loader2 } from "react-icons/lu";
import {
  type CreateTagDTO,
  createTagSchema,
  type Tag,
} from "@/server/schema/tag.schema";
import { trpc } from "@/trpc/react";

interface Props {
  currentRow?: Tag;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TagsActionDialog({ currentRow, open, onOpenChange }: Props) {
  const utils = trpc.useUtils();
  const isEdit = !!currentRow;
  const form = useForm<CreateTagDTO>({
    resolver: zodResolver(createTagSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          description: currentRow.description ?? undefined,
        }
      : {
          description: "",
          tagName: "",
        },
  });
  const { mutateAsync: createTagAsync, isPending: isCreatingTag } =
    trpc.tags.createTag.useMutation();
  const { mutateAsync: updateTagAsync, isPending: isUpdatingTag } =
    trpc.tags.updateTag.useMutation();

  const onSubmit = async (values: CreateTagDTO) => {
    form.reset();
    if (isEdit) {
      await updateTagAsync({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tagId: currentRow.tagId as any,
        ...values,
      });
    } else {
      await createTagAsync(values);
    }
    utils.tags.getTags.invalidate();
    toast({
      title: isEdit ? "Thẻ đã được cập nhật" : "Thẻ đã được tạo",
    });
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{isEdit ? "Cập nhật thẻ" : "Tạo thẻ mới"}</DialogTitle>

          <DialogDescription>
            {/* {isEdit ? "Update the user here. " : "Create new user here. "} */}
            Nhấn vào nút &quot;Lưu thay đổi&quot; để{" "}
            {isEdit ? "cập nhật" : "tạo mới"} thẻ.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="-mr-4 w-full py-1 pr-4">
          <Form {...form}>
            <form
              id="user-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 p-0.5"
            >
              <FormField
                control={form.control}
                name="tagName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên thẻ</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Binary Search"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field: { value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Thuật toán tìm kiếm nhị phân"
                        {...rest}
                        value={value ?? undefined}
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
            disabled={isCreatingTag || isUpdatingTag}
          >
            {(isUpdatingTag || isCreatingTag) && (
              <Loader2 className="animate-spin" />
            )}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
