"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { LuEraser, LuSearch as Search } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FancyMultiSelect } from "@/components/ui/fancy-multi-select";
import { useDebounce } from "use-debounce";
import { Controller, useForm } from "react-hook-form";
import { DifficultyLevel, parseDifficultyLevel } from "@/server/schema/enum";

// Tách tags ra constant riêng để tránh re-render
const DIFFICULTY_OPTIONS = [
  { label: "Tất cả độ khó", value: "0" },
  { label: "Dễ", value: DifficultyLevel.EASY.toString() },
  { label: "Trung bình", value: DifficultyLevel.MEDIUM.toString() },
  { label: "Khó", value: DifficultyLevel.HARD.toString() },
] as const;

const TAG_OPTIONS = [
  "Array",
  "String",
  "Hash Table",
  "Dynamic Programming",
  "Math",
  "Sorting",
  "Greedy",
  "Depth-First Search",
  "Binary Search",
  "Database",
  "Breadth-First Search",
  "Tree",
  "Matrix",
  "Two Pointers",
  "Bit Manipulation",
].map((tag) => ({ label: tag, value: tag }));

interface FilterParams {
  search?: string;
  difficulty?: DifficultyLevel;
  tags?: string[];
}

export default function ProblemFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Memo defaultValues để tránh re-render không cần thiết
  const defaultValues = useMemo(
    () => ({
      search: searchParams.get("search") || "",
      difficulty: parseDifficultyLevel(searchParams.get("difficulty")),
      tags: searchParams.getAll("tags"),
    }),
    [searchParams],
  );

  const { control, watch } = useForm<FilterParams>({
    defaultValues,
  });

  const search = watch("search");
  const [debouncedSearch] = useDebounce(search, 1000);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sử dụng useCallback để tối ưu function
  const updateSearchParams = useCallback(
    (params: URLSearchParams) => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router],
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    updateSearchParams(params);
  }, [debouncedSearch, updateSearchParams, searchParams]);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    const { search, difficulty, tags } = watch();

    // Xử lý search
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    // Xử lý difficulty
    if (difficulty) {
      params.set("difficulty", difficulty.toString());
    } else {
      params.delete("difficulty");
    }

    // Xử lý tags
    params.delete("tags"); // Xóa tất cả tags cũ
    tags?.forEach((tag) => params.append("tags", tag));

    updateSearchParams(params);
  }, [searchParams, watch, updateSearchParams]);

  const tagIds = watch("tags");
  const selectedTags = useMemo(
    () => tagIds?.map((tag) => ({ label: tag, value: tag })) || [],
    [tagIds],
  );
  const handleClear = useCallback(() => {
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "20";
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("pageSize", pageSize);
    updateSearchParams(params);

    searchInputRef.current?.focus();
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <div className="flex w-full gap-4">
        <div className="relative basis-1/2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Controller
            control={control}
            name="search"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Tìm kiếm bài tập..."
                className="w-full pl-9"
                ref={searchInputRef}
              />
            )}
          />
        </div>

        <div className="basis-1/2">
          <Controller
            control={control}
            name="difficulty"
            render={({ field }) => (
              <Select
                value={field.value?.toString() || ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Độ khó" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="w-full flex-1">
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <FancyMultiSelect
              options={TAG_OPTIONS}
              placeholder="Chọn thẻ"
              onChange={(setAction) => {
                if (typeof setAction === "function") {
                  const newTags = setAction(selectedTags);
                  field.onChange(newTags.map((tag) => tag.value));
                  return;
                }
                field.onChange(setAction.map((tag) => tag.value));
              }}
              selectedOptions={selectedTags}
              className="w-full"
            />
          )}
        />
      </div>
      <div className="grid w-full grid-cols-2 gap-2">
        <Button onClick={applyFilters}>Áp dụng</Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleClear}
        >
          <LuEraser className="h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  );
}
