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
import { nanoid } from "nanoid";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { LuLoader as Loader2 } from "react-icons/lu";
import {
  type CreateRoleInput,
  createRoleSchema,
  type Role,
} from "@/server/schema/role";
import { trpc } from "@/trpc/react";

interface Props {
  currentRow?: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RolesActionDialog({ currentRow, open, onOpenChange }: Props) {
  const utils = trpc.useUtils();
  const isEdit = !!currentRow;
  const form = useForm<CreateRoleInput>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: isEdit
      ? ({
          ...currentRow,
          description: currentRow.description ?? undefined,
        } as unknown as CreateRoleInput)
      : ({
          description: "",
          roleName: "",
          id: nanoid(10),
        } as CreateRoleInput),
  });
  const { mutateAsync: createRoleAsync, isPending: isCreatingRole } =
    trpc.roles.createRole.useMutation();
  const { mutateAsync: updateRoleAsync, isPending: isUpdatingRole } =
    trpc.roles.updateRole.useMutation();

  const onSubmit = async (values: CreateRoleInput) => {
    form.reset();
    if (isEdit) {
      await updateRoleAsync({
        ...values,
        id: currentRow.roleId,
      });
    } else {
      await createRoleAsync(values);
    }
    utils.roles.getRoles.invalidate();
    toast({
      title: isEdit ? "Vai trò đã được cập nhật" : "Vai trò đã được tạo",
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
          <DialogTitle>
            {isEdit ? "Cập nhật vai trò" : "Tạo vai trò mới"}
          </DialogTitle>

          <DialogDescription>
            Nhấn vào nút &quot;Lưu thay đổi&quot; để{" "}
            {isEdit ? "cập nhật" : "tạo mới"} vai trò.
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
                name="id"
                defaultValue={nanoid(10)}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Id</FormLabel>
                    <FormControl>
                      <Input readOnly type="text" placeholder="Id" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên vai trò</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Người đóng góp"
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
                        placeholder="Mô tả"
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
            disabled={isCreatingRole || isUpdatingRole}
          >
            {(isUpdatingRole || isCreatingRole) && (
              <Loader2 className="animate-spin" />
            )}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
