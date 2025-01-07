"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { DifficultyLevel } from "@/server/schema/enum";
import { type Problem } from "@/server/schema/problem.schema";

const getDifficultyBadge = (difficulty: DifficultyLevel) => {
  switch (difficulty) {
    case DifficultyLevel.EASY:
      return <Badge variant="success">Dễ</Badge>;
    case DifficultyLevel.MEDIUM:
      return <Badge variant="warning">Trung bình</Badge>;
    case DifficultyLevel.HARD:
      return <Badge variant="danger">Khó</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};
interface Props {
  problems: Partial<Problem>[];
}

export default function ProblemsTable({ problems }: Props) {
  const { push } = useRouter();
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Độ khó</TableHead>
              <TableHead>Tỷ lệ chấp nhận</TableHead>
              {/* <TableHead>Tags</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems.map((problem) => (
              <TableRow
                key={problem.problemId}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => push(`/problems/${problem.problemId}`)}
              >
                <TableCell>
                  {/* {problem. && (
										<CheckCircle2 className="h-5 w-5 text-green-500" />
									)} */}
                </TableCell>
                <TableCell className="font-medium">{problem.title}</TableCell>
                <TableCell>
                  {getDifficultyBadge(
                    problem.difficultyLevel || DifficultyLevel.EASY,
                  )}
                </TableCell>
                <TableCell>{problem.acceptedSubmissions || "50.1%"}</TableCell>
                {/* <TableCell>
									<div className="flex gap-2 flex-wrap">
									{problem.tags.map((tag, index) => (
											<Badge
												key={index}
												variant="secondary"
											>
												{tag}
											</Badge>
										))} 
									</div>
								</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
