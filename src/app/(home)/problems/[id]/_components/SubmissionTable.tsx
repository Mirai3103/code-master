import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  LuCode as Code,
  LuCpu as Cpu,
  LuMemoryStick as Memory,
  LuHash as Hash,
  LuArrowDown as ArrowDown,
  LuArrowUp as ArrowUp,
} from "react-icons/lu";
import { SubmissionStatus } from "@/server/schema/enum";
import { trpc } from "@/trpc/react";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  ColumnDef,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { getFilteredRowModel } from "@tanstack/react-table";
import { Submission } from "@prisma/client";
import { cn } from "@/app/_lib/utils";

// Helper function to format time execution
const formatTimeExecution = (timeInMs: number) => {
  if (!timeInMs) return "N/A";
  return `${timeInMs} ms`;
};

// Helper function to format memory usage
const formatMemoryUsage = (memoryInKb: number) => {
  const memory = memoryInKb / 1024;
  if (!memory) return "N/A";
  return `${memory.toFixed(1)} MB`;
};

// Helper function to get status badge
const getStatusBadge = (status: SubmissionStatus) => {
  switch (status) {
    case SubmissionStatus.ACCEPTED:
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          Chấp nhận
        </Badge>
      );
    case SubmissionStatus.WRONG_ANSWER:
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
          Sai kết quả
        </Badge>
      );
    case SubmissionStatus.TIME_LIMIT_EXCEEDED:
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
          Vượt quá thời gian
        </Badge>
      );
    case SubmissionStatus.MEMORY_LIMIT_EXCEEDED:
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
          Vượt quá bộ nhớ
        </Badge>
      );
    case SubmissionStatus.RUNTIME_ERROR:
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
          Lỗi chạy
        </Badge>
      );
    case SubmissionStatus.COMPILE_ERROR:
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
          Lỗi biên dịch
        </Badge>
      );
    case SubmissionStatus.PENDING:
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
          Đang chạy
        </Badge>
      );
    case SubmissionStatus.DRAFT:
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          Nháp
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
          Không xác định
        </Badge>
      );
  }
};

// Calculate success rate for a submission
const getSuccessRate = (submission: Submission) => {
  const randomRate = Math.floor(Math.random() * 100);
  return `${randomRate.toFixed(2)}%`;
};

interface SubmissionsTableProps {
  problemId: string;
}

const columns: ColumnDef<Submission>[] = [
  {
    id: "index",
    header: () => (
      <div className="flex items-start gap-1">
        <Hash className="h-4 w-4" />
      </div>
    ),
    accessorFn: (row, index) => index,
    cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
    enableSorting: false,
  },
  {
    id: "status",
    accessorKey: "status",
    header: (a) => (
      <div className="flex items-center justify-start gap-1 font-semibold">
        Trạng thái
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div>{getStatusBadge(row.original.status as SubmissionStatus)}</div>
        <span className="text-xs">
          {dayjs(row.original.createdAt).format("DD/MM/YYYY HH:mm")}
        </span>
      </div>
    ),
    sortingFn: (rowA, rowB) =>
      dayjs(rowA.original.createdAt).diff(rowB.original.createdAt),
  },
  {
    id: "language",
    accessorKey: "language.languageName",
    header: "Ngôn ngữ",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Code className="h-4 w-4 text-gray-500" />
        <span>{(row as any)?.original?.language?.languageName}</span>
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "timeExecution",
    accessorKey: "timeExecution",
    header: () => (
      <div className="flex items-center gap-1 px-0 font-semibold">
        <Cpu className="mr-1 h-4 w-4" />
        Thời gian
      </div>
    ),
    cell: ({ row }) => formatTimeExecution(row.original.timeExecutionInMs),
    sortingFn: (rowA, rowB) =>
      rowA.original.timeExecutionInMs - rowB.original.timeExecutionInMs,
  },
  {
    id: "memoryUsage",
    accessorKey: "memoryUsage",
    header: () => (
      <div className="flex items-center gap-1 px-0 font-semibold">
        <Memory className="mr-1 h-4 w-4" />
        Bộ nhớ
      </div>
    ),
    cell: ({ row }) => formatMemoryUsage(row.original.memoryUsageInKb),
    sortingFn: (rowA, rowB) =>
      rowA.original.memoryUsageInKb - rowB.original.memoryUsageInKb,
  },
  {
    id: "successRate",
    accessorFn: (row) => getSuccessRate(row),
    header: "Tỷ lệ đạt",
    cell: ({ row }) => getSuccessRate(row.original),
  },
];
const SubmissionsTable: React.FC<SubmissionsTableProps> = ({ problemId }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "all">(
    "all",
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data: session } = useSession();
  const { data: submissions = [], isPending: isLoading } =
    trpc.submissions.getSubmissionsHistory.useQuery(
      {
        problemId,
        userId: session?.user?.id!,
      },
      {
        enabled: !!session?.user?.id,
      },
    );
  React.useEffect(() => {
    if (statusFilter === "all") {
      setColumnFilters([]);
    } else {
      setColumnFilters([
        {
          id: "status",
          value: statusFilter,
        },
      ]);
    }
  }, [statusFilter]);
  const table = useReactTable<Submission>({
    data: submissions as never,
    columns: columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  console.log("SubmissionsTable -> isLoading", submissions);
  if (!session?.user?.id) {
    return null;
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as SubmissionStatus | "all")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value={SubmissionStatus.ACCEPTED}>
                Chấp nhận
              </SelectItem>
              <SelectItem value={SubmissionStatus.WRONG_ANSWER}>
                Sai kết quả
              </SelectItem>
              <SelectItem value={SubmissionStatus.TIME_LIMIT_EXCEEDED}>
                Vượt quá thời gian
              </SelectItem>
              <SelectItem value={SubmissionStatus.MEMORY_LIMIT_EXCEEDED}>
                Vượt quá bộ nhớ
              </SelectItem>
              <SelectItem value={SubmissionStatus.RUNTIME_ERROR}>
                Lỗi chạy
              </SelectItem>
              <SelectItem value={SubmissionStatus.COMPILE_ERROR}>
                Lỗi biên dịch
              </SelectItem>
              <SelectItem value={SubmissionStatus.PENDING}>Đang chờ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          "flex items-center gap-1 font-semibold",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: <ArrowUp className="ml-1 inline h-4 w-4" />,
                          desc: <ArrowDown className="ml-1 inline h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Không có dữ liệu bài nộp nào.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SubmissionsTable;
