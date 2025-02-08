"use client";
import { Role } from "@/server/schema/role";
import { LuTrash2, LuSave } from "react-icons/lu";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { TbArrowLeft as IconArrowLeft } from "react-icons/tb";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreateRoleInput, createRoleSchema, Rule } from "@/server/schema/role";
import { Main } from "@/app/_components/layout/main";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { trpc } from "@/trpc/react";
import RuleActionForm from "../../_components/RuleActionForm";
import { toast } from "@/app/_hooks/use-toast";
import { useRouter } from "next/navigation";

interface IProp {
  role: Role;
}
export default function EditForm({ role }: IProp) {
  const [{ data: actions }, { data: resources }] = trpc.useQueries((t) => {
    return [t.permissions.getActions(), t.permissions.getResources()];
  });
  const form = useForm<CreateRoleInput & { isTouchedRules: boolean }>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      ...(role as any),
      isTouchedRules: false,
    },
  });
  const { mutateAsync } = trpc.roles.updateRole.useMutation();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  const handleAddRule = (rule: Rule) => {
    form.setValue("isTouchedRules", true);
    append(rule);
  };

  const router = useRouter();
  const onSubmit = (data: CreateRoleInput) => {
    console.log("Form data:", data);
    mutateAsync(data)
      .then((data) => {
        toast({
          duration: 3000,
          title: "Thành công",
          description: "Vai trò đã được tạo thành công",
        });
        router.push("/admin/roles");
      })
      .catch((err) => {
        toast({
          duration: 3000,
          title: "Thất bại",
          description: "Đã có lỗi xảy ra",
        });
      });
  };
  return (
    <div>
      <Header sticky>
        <div className="ml-auto flex items-center space-x-4" />
      </Header>

      <Main>
        {/* Header Section */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Sửa vai trò: <b>{role.roleName}</b>
            </h2>
          </div>
          <Button asChild variant="outline" className="space-x-2">
            <Link href="/admin/roles">
              <IconArrowLeft size={18} />
              <span>Quay lại</span>
            </Link>
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tên Role */}
            <FormField
              control={form.control}
              name="roleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên role..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mô tả */}
            <FormField
              control={form.control}
              name="description"
              render={({ field: { value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả cho role này..."
                      value={value ?? undefined}
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thêm Rule mới */}
            <div className="space-y-4 rounded-lg border p-4">
              <RuleActionForm mode="create" onSubmit={handleAddRule} />
            </div>
            {/* Danh sách Rules */}
            <div className="space-y-4">
              <h3 className="font-semibold">Danh sách quyền</h3>
              {fields.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    Chưa có quyền nào được thêm.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {fields.map((rule, index) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {rule.action.map((action) => (
                            <Badge key={action} variant="secondary">
                              {
                                actions?.find((a) => a.actionId === action)
                                  ?.actionName
                              }
                            </Badge>
                          ))}
                          <span className="font-medium">
                            {rule.subject
                              .map(
                                (subject) =>
                                  resources?.find(
                                    (resource) =>
                                      resource.resourceId === subject,
                                  )?.resourceName,
                              )
                              .join(", ")}
                          </span>
                        </div>
                        {(rule.fields?.length || 0) > 0 && (
                          <div className="text-sm text-gray-600">
                            Fields: {rule.fields!.join(", ")}
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          remove(index);
                          form.setValue("isTouchedRules", true);
                        }}
                      >
                        <LuTrash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Error Message */}
            {form.formState.errors.rules && (
              <Alert variant="destructive">
                <AlertDescription>
                  {form.formState.errors.rules.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              <LuSave className="mr-2 h-4 w-4" />
              Lưu Role
            </Button>
          </form>
        </Form>
      </Main>
    </div>
  );
}
