import { Controller, useForm } from "react-hook-form";
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
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  EditUserRolesInput,
  editUserRolesSchema,
  User,
} from "@/server/schema/user.schema";
import { trpc } from "@/trpc/react";
import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import { FancyMultiSelect } from "@/app/_components/ui/fancy-multi-select";

interface Props {
  currentRow?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsersEditPermissionDialog({
  currentRow,
  open,
  onOpenChange,
}: Props) {
  const utils = trpc.useUtils();
  const [tab, setTab] = React.useState<"role" | "permission">("role");
  const form = useForm<EditUserRolesInput>({
    resolver: zodResolver(editUserRolesSchema),
    defaultValues: {
      roles: ["everyone"],
      userId: currentRow?.id!,
    },
  });
  const { data: roles } = trpc.roles.getRoles.useQuery();

  const onSubmit = async (values: EditUserRolesInput) => {
    utils.users.getUsers.invalidate();
    toast({
      title: "Người dùng đã được cập nhật",
    });
    form.reset();

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
          <DialogTitle>{"Phân quyền"}</DialogTitle>

          <DialogDescription>
            Nhấn vào nút &quot;Lưu thay đổi&quot; để lưu
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="-mr-4 w-full py-1 pr-4">
          <Tabs
            defaultValue="role"
            className="w-full"
            value={tab}
            onValueChange={setTab as any}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="role">Vai trò</TabsTrigger>
              <TabsTrigger value="permission">Quyền</TabsTrigger>
            </TabsList>
            <TabsContent value="permission">
              <Form {...form}>
                <form
                  id="user-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 p-1"
                ></form>
              </Form>
            </TabsContent>
            <TabsContent value="role">
              <Form {...form}>
                <form
                  id="user-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="relative space-y-4 p-1"
                >
                  <Controller
                    control={form.control}
                    name="roles"
                    render={({ field }) => (
                      <FancyMultiSelect
                        floatingList={false}
                        options={
                          roles?.map((role) => {
                            return {
                              label: role.roleName,
                              value: role.roleId,
                            };
                          }) || []
                        }
                        placeholder="Chọn  vai trò"
                        onChange={(setAction) => {
                          if (typeof setAction === "function") {
                            let newTags = setAction(
                              (field.value || []).map((o) => {
                                return {
                                  label:
                                    roles?.find((r) => r.roleId === o)
                                      ?.roleName || "",
                                  value: o,
                                };
                              }),
                            );
                            // nếu k có everyone thì thêm vào
                            if (
                              !newTags.find((tag) => tag.value === "everyone")
                            ) {
                              newTags.push({
                                label: "Mặc định",
                                value: "everyone",
                              });
                            }
                            field.onChange(newTags.map((tag) => tag.value));
                            return;
                          }
                          if (
                            !setAction.find((tag) => tag.value === "everyone")
                          ) {
                            setAction.push({
                              label: "Mặc định",
                              value: "everyone",
                            });
                          }
                          field.onChange(setAction.map((tag) => tag.value));
                        }}
                        selectedOptions={(field.value || []).map((o) => {
                          return {
                            label:
                              roles?.find((r) => r.roleId === o)?.roleName ||
                              "",
                            value: o,
                          };
                        })}
                      />
                    )}
                  />
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" form="user-form">
            {/* {(isUpdatingUser || isCreatingUser) && (
              <Loader2 className="animate-spin" />
            )} */}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
