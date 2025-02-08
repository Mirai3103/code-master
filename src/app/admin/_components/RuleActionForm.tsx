"use client";
import { LuCirclePlus } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Rule, ruleSchema } from "@/server/schema/role";
import { trpc } from "@/trpc/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import { FancyMultiSelect } from "@/app/_components/ui/fancy-multi-select";

interface IProps {
  mode: "edit" | "create";
  rule?: Rule;
  onSubmit: (data: Rule) => void;
}
export default function RuleActionForm({
  mode = "create",
  rule,
  onSubmit,
}: IProps) {
  const [{ data: actions }, { data: resources }] = trpc.useQueries((t) => {
    return [t.permissions.getActions(), t.permissions.getResources()];
  });
  const currentRuleForm = useForm<Rule>({
    resolver: zodResolver(ruleSchema),
    defaultValues:
      mode == "edit"
        ? rule
        : {
            action: [],
            subject: [],
            fields: undefined,
            inverted: false,
            condition: undefined,
            reason: undefined,
          },
  });

  const handleSubmit = (data: Rule) => {
    onSubmit(data);
    currentRuleForm.reset();
  };

  return (
    <Form {...currentRuleForm}>
      <h3 className="font-semibold">Thêm quyền Mới</h3>
      {/* Chọn Actions */}
      <div className="space-y-2">
        <FormField
          control={currentRuleForm.control}
          name="action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hành động (Actions)</FormLabel>

              <FormControl>
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
                                field.value.includes(action.actionId as any)
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Chọn Subject */}
      <div className="space-y-2">
        <FormField
          control={currentRuleForm.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đối tượng (Subject)</FormLabel>

              <FormControl>
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
              </FormControl>
              <FormMessage />
            </FormItem>
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
        onClick={() => currentRuleForm.handleSubmit(handleSubmit)()}
        disabled={currentRuleForm.formState.isSubmitting}
        className="mt-4"
      >
        <LuCirclePlus className="mr-2 h-4 w-4" />
        Thêm Rule
      </Button>
    </Form>
  );
}
