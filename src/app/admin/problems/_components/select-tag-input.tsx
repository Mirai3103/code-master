import {
  FancyMultiSelect,
  type FancyMultiSelectOption,
} from "@/components/ui/fancy-multi-select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { trpc } from "@/trpc/react";
import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { v4 as uuid } from "uuid";
interface SelectTagInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function SelectTagInput({ form }: SelectTagInputProps) {
  // Queries
  const { data: tags } = trpc.tags.getTags.useQuery(
    {
      order: "asc",
      orderBy: "tagName",
      pageSize: 1000,
    },
    {
      select: (data) =>
        data[0].map((tag) => ({
          value: tag.tagId,
          label: tag.tagName,
        })) as FancyMultiSelectOption[],
    },
  );
  // Handlers
  const handleCreateTag = (label: string) => {
    const newId = uuid();
    const newTag = { value: newId, label };
    form.setValue("newTags", [...form.getValues().newTags, newTag]);
    return newTag;
  };
  const newTags = form.watch("newTags");
  const options = React.useMemo(() => {
    return [...(tags || []), ...(newTags || [])];
  }, [tags, newTags]);

  return (
    <FormField
      control={form.control}
      name="selectedTags"
      render={({ field: { onChange, ...field } }) => (
        <FormItem>
          <FormLabel>Thẻ (tags)</FormLabel>
          <FormControl>
            <FancyMultiSelect
              options={options}
              {...field}
              placeholder="Chọn thẻ"
              withCreateNew
              onCreateNew={handleCreateTag}
              createNewProps={{
                title: "Tạo thẻ mới",
                titleDescription: "Tạo thẻ mới cho bài toán",
                label: "Tên thẻ",
                placeholder: "Nhập tên thẻ",
              }}
              onChange={(
                options:
                  | FancyMultiSelectOption[]
                  | ((
                      prev: FancyMultiSelectOption[],
                    ) => FancyMultiSelectOption[]),
              ) => {
                if (Array.isArray(options)) {
                  onChange(options);
                  return;
                }
                const newOptions = options(form.getValues().selectedTags);
                console.log(newOptions, field.value);
                onChange(newOptions);
              }}
              selectedOptions={field.value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
