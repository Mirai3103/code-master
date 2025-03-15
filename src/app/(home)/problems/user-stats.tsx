"use client";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { LuChartBar as BarChart2 } from "react-icons/lu";

const userStats = {
  rank: 1234,
  totalSolved: 127,
  streak: 15,
  contestRating: 1756,
};

function Skeleton() {
  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center">
        <div className="mr-2 h-5 w-5 animate-pulse rounded bg-gray-200"></div>
        <div className="h-6 w-40 animate-pulse rounded bg-gray-200"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex items-center justify-between">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function UserStats() {
  const session = useSession();
  if (session.status === "loading") return <Skeleton />;
  if (session.status === "unauthenticated") return null;

  return (
    <Card className="p-4">
      <h3 className="mb-4 flex items-center text-lg font-semibold">
        <BarChart2 className="mr-2 h-5 w-5 text-blue-600" />
        Thống Kê Cá Nhân
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Contest Rating</span>
          <span className="font-medium text-blue-600">
            {userStats.contestRating}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Bài đã giải</span>
          <span className="font-medium text-green-600">
            {userStats.totalSolved}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Streak hiện tại</span>
          <span className="font-medium text-yellow-600">
            {userStats.streak} ngày
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Xếp hạng</span>
          <span className="font-medium text-purple-600">
            Top {userStats.rank}
          </span>
        </div>
      </div>
    </Card>
  );
}
