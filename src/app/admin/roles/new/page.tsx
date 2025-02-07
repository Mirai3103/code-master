"use client";
import { LuCirclePlus, LuTrash2, LuSave } from "react-icons/lu";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import { FancyMultiSelect } from "@/app/_components/ui/fancy-multi-select";
// Giả lập dữ liệu từ BE
const mockSubjects = ["users", "products", "orders", "categories", "customers"];
const mockFields = {
  users: ["id", "name", "email", "phone", "address"],
  products: ["id", "name", "price", "stock", "category"],
  orders: ["id", "total", "status", "items", "customer"],
  categories: ["id", "name", "description"],
  customers: ["id", "name", "email", "orders"],
};

const ACTIONS = ["create", "read", "update", "delete", "manage"];

// Zod Schemas

const RoleManagement = () => {
  const [{ data: actions }, { data: resources }] = trpc.useQueries((t) => {
    return [t.permissions.getActions(), t.permissions.getResources()];
  });
  const form = useForm<CreateRoleInput>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      roleName: "",
      description: "",
      rules: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  const currentRuleForm = useForm<Rule>({
    defaultValues: {
      action: [],
      subject: [],
      fields: [],
      inverted: false,
      condition: undefined,
      reason: undefined,
    },
  });

  const handleAddRule = (rule: Rule) => {
    append(rule);
    currentRuleForm.reset();
  };

  const onSubmit = (data: CreateRoleInput) => {
    console.log("Form data:", data);
    // Thêm logic gọi API ở đây
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
              Thêm bài toán mới
            </h2>
            <p className="text-muted-foreground">
              Thêm bài toán mới vào hệ thống
            </p>
          </div>
          <Button asChild variant="outline" className="space-x-2">
            <Link href="/admin/problems">
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
              <h3 className="font-semibold">Thêm quyền Mới</h3>
              {/* Chọn Actions */}
              <div className="space-y-2">
                <Label>Hành động (Actions)</Label>
                <div className="flex flex-wrap gap-2">
                  <Controller
                    control={currentRuleForm.control}
                    name="action"
                    render={({ field }) => (
                      <div>
                        {actions?.map((action) => (
                          <TooltipProvider key={action.actionId}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant={
                                    field.value.includes(action.actionId as any)
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() => {
                                    if (
                                      field.value.includes(
                                        action.actionId as any,
                                      )
                                    ) {
                                      field.onChange(
                                        field.value.filter(
                                          (a) => a !== action.actionId,
                                        ),
                                      );
                                    } else {
                                      field.onChange([
                                        ...field.value,
                                        action.actionId,
                                      ]);
                                    }
                                  }}
                                  className="mx-1 capitalize"
                                >
                                  {action.actionName}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{action.description || action.actionName}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    )}
                  />
                </div>
              </div>
              {/* Chọn Subject */}
              <div className="space-y-2">
                <Label>Đối tượng (Subject)</Label>

                <Controller
                  control={currentRuleForm.control}
                  name="subject"
                  render={({ field }) => (
                    <FancyMultiSelect
                      options={
                        resources?.map((resource) => ({
                          label: resource.resourceName,
                          value: resource.resourceId,
                        })) || []
                      }
                      placeholder="Chọn đối tượng"
                      onChange={(setAction) => {
                        if (typeof setAction === "function") {
                          const currentSelected = field.value
                            .map(
                              (value) =>
                                resources?.find(
                                  (resource) => resource.resourceId === value,
                                )!,
                            )
                            .map((resource) => ({
                              label: resource.resourceName,
                              value: resource.resourceId,
                            }));
                          const newTags = setAction(currentSelected);
                          field.onChange(newTags.map((tag) => tag.value));
                          return;
                        }
                        field.onChange(setAction.map((tag) => tag.value));
                      }}
                      selectedOptions={field.value
                        .map(
                          (value) =>
                            resources?.find(
                              (resource) => resource.resourceId === value,
                            )!,
                        )
                        .map((resource) => ({
                          label: resource.resourceName,
                          value: resource.resourceId,
                        }))}
                    />
                  )}
                />
              </div>

              {/* Chọn Fields */}
              {/* {currentSubject && (
                <div className="space-y-2">
                  <Label>Trường dữ liệu (Fields)</Label>
                  <div className="flex flex-wrap gap-2">
                    {mockFields[currentSubject[0] as any]?.map(
                      (field: string) => (
                        <Button
                          type="button"
                          key={field}
                          variant={
                            selectedFields.includes(field)
                              ? "default"
                              : "outline"
                          }
                          onClick={() => {
                            setSelectedFields((prev) =>
                              prev.includes(field)
                                ? prev.filter((f) => f !== field)
                                : [...prev, field],
                            );
                          }}
                        >
                          {field}
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              )} */}

              <Button
                type="button"
                onClick={() => currentRuleForm.handleSubmit(handleAddRule)()}
                disabled={currentRuleForm.formState.isSubmitting}
                className="mt-4"
              >
                <LuCirclePlus className="mr-2 h-4 w-4" />
                Thêm Rule
              </Button>
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
                        {rule.fields?.length && (
                          <div className="text-sm text-gray-600">
                            Fields: {rule.fields!.join(", ")}
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
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
};

export default RoleManagement;
