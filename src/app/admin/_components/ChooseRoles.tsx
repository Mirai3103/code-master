"use client";
import { trpc } from '@/trpc/react';
import { FancyMultiSelect, FancyMultiSelectOption } from "@/components/ui/fancy-multi-select";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/app/_components/ui/form';
import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/app/_components/ui/button';

interface ChooseRolesProps {
    onSubmit: (roleIds: string[]) => void
    onCancel: () => void
}

interface ChooseRolesForm {
    selectedTags: FancyMultiSelectOption[];
}
const chooseRolesFormSchema = z.object({
    selectedTags: z.array(z.object({
        label: z.string(),
        value: z.string(),
    })).min(1, "Vui lòng chọn ít nhất 1 vai trò"),
});


export default function ChooseRoles({ onSubmit, onCancel }: ChooseRolesProps) {
    const { data, isLoading } = trpc.roles.getRoles.useQuery()
    const form = useForm<ChooseRolesForm>({
        resolver: zodResolver(chooseRolesFormSchema),
        defaultValues: {
            selectedTags: [],
        },
    });
    const options = React.useMemo(() => {
        if (!data) return [];
        return data.map((role) => ({
            label: role.roleName,
            value: role.roleId,
        }));
    }, [data]);
    const handleSubmit = (data: any) => {
        onSubmit(data.selectedTags.map((tag: FancyMultiSelectOption) => tag.value))
    }

    return (
        <Form {...form}>
            <form  className="space-y-2">
                <FormField
                    control={form.control}
                    name="selectedTags"
                    render={({ field: { onChange, ...field } }) => (
                        <FormItem>
                            <FormLabel>
                                Vai trò
                            </FormLabel>
                            <FormControl
                            >
                                <FancyMultiSelect
                                    options={options}
                                    {...field}
                                    placeholder="Chọn vai trò"
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
                                        onChange(newOptions);
                                    }}
                                    selectedOptions={field.value}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                <div className="flex justify-end space-x-2">
                    <Button type="button" 
                    variant={"ghost"}
                    onClick={onCancel}>
                        Hủy
                    </Button>
                    <Button type="button" onClick={() => form.handleSubmit(handleSubmit)()}>
                    Chọn
                    </Button>

                </div>
            </form>
        </Form>
    )
}
