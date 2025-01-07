"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
const popularTags = [
  "Array",
  "String",
  "Dynamic Programming",
  "Tree",
  "Database",
  "Math",
];
export default function HotProblems() {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="mb-4 font-semibold">Bài toán hot</h3>
        <div className="flex flex-col gap-2">
          {popularTags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-gray-200"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
