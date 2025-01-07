"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { LuSearch as Search, LuShuffle as Shuffle } from "react-icons/lu";
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

const tags = [
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
];

interface FilterParams {
  search?: string;
  difficulty?: DifficultyLevel;
  tags?: string[];
}

export default function ProblemFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { control, watch } = useForm<FilterParams>({
    defaultValues: {
      search: searchParams.get("search") || "",
      difficulty: parseDifficultyLevel(searchParams.get("difficulty")),
      tags: searchParams.getAll("tags"),
    },
  });

  const search = watch("search");
  const [debouncedSearch] = useDebounce(search, 1000);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, pathname, router]);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    const { search, difficulty, tags } = watch();
    if (search) {
      params.set("search", search);
    }
    if (difficulty) {
      params.set("difficulty", difficulty.toString());
    }
    if (tags) {
      tags.forEach((tag) => params.append("tags", tag));
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, watch]);
  const tagids = watch("tags");
  const selectedTags = useMemo(
    () => tagids?.map((tag) => ({ label: tag, value: tag })) || [],
    [tagids?.length],
  );
  console.log("rendering ProblemFilters");
  return (
    <div className="mb-6 grid grid-cols-12 gap-4">
      <div className="relative col-span-2">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Controller
          control={control}
          name="search"
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Tìm kiếm bài tập..."
              className="pl-9"
              ref={searchInputRef}
            />
          )}
        />
      </div>

      <div className="col-span-2">
        <Controller
          control={control}
          name="difficulty"
          render={({ field }) => (
            <Select
              value={field.value?.toString() || ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Tất cả độ khó</SelectItem>
                <SelectItem value={DifficultyLevel.EASY.toString()}>
                  Dễ
                </SelectItem>
                <SelectItem value={DifficultyLevel.MEDIUM.toString()}>
                  Trung bình
                </SelectItem>
                <SelectItem value={DifficultyLevel.HARD.toString()}>
                  Khó
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="col-span-3">
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <FancyMultiSelect
              options={tags.map((tag) => ({
                label: tag,
                value: tag,
              }))}
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
            />
          )}
        />
      </div>

      <div className="col-span-1">
        <Button onClick={applyFilters}>Áp dụng</Button>
      </div>

      <div className="col-span-1">
        <Button variant="outline" className="flex items-center gap-2">
          <Shuffle className="h-4 w-4" />
          Random
        </Button>
      </div>
    </div>
  );
}
