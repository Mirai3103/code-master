import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
  useQueryStates,
} from "nuqs";
interface PaginationParams {
  defaultPage?: number;
  defaultPageSize?: number;
  defaultSearch?: string;
  defaultSortBy?: string;
  defaultSortOrder?: "asc" | "desc";
}
export default function usePaginationParams({
  defaultPage = 1,
  defaultPageSize = 10,
  defaultSearch = "",
  defaultSortOrder = "asc",
  defaultSortBy = "",
}: PaginationParams) {
  return useQueryStates({
    page: parseAsInteger.withDefault(defaultPage),
    pageSize: parseAsInteger.withDefault(defaultPageSize),
    search: parseAsString.withDefault(defaultSearch),
    sortBy: parseAsString.withDefault(defaultSortBy),
    sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault(defaultSortOrder),
  });
}

export function useSearchParam() {
  return useQueryState("search", parseAsString.withDefault(""));
}

export function useSortingParams({
  defaultSortOrder = "asc",
  defaultSortBy = "",
}: Pick<PaginationParams, "defaultSortOrder" | "defaultSortBy">) {
  return useQueryStates({
    sortBy: parseAsString.withDefault(defaultSortBy),
    sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault(defaultSortOrder),
  });
}
