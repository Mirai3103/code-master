import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import { LuClock, LuTrophy, LuUsers } from "react-icons/lu";
const contests = [
  { name: "Weekly Contest 375", time: "Chủ Nhật, 9:30", participants: 1200 },
  { name: "Biweekly Contest 120", time: "Thứ 7, 20:00", participants: 800 },
];
export default function UpcomingContest() {
  return (
    <Card className="p-4">
      <h3 className="mb-3 flex items-center text-lg font-semibold">
        <LuTrophy className="mr-2 h-5 w-5 text-blue-600" />
        Cuộc Thi Sắp Tới
      </h3>
      <div className="space-y-4">
        {contests.map((contest, idx) => (
          <div key={idx} className="space-y-2">
            <div className="font-medium text-gray-900">{contest.name}</div>
            <div className="flex justify-between text-sm text-gray-600">
              <span className="flex items-center">
                <LuClock className="mr-1 h-4 w-4" />
                {contest.time}
              </span>
              <span className="flex items-center">
                <LuUsers className="mr-1 h-4 w-4" />
                {contest.participants}
              </span>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full">
          Xem Tất Cả
        </Button>
      </div>
    </Card>
  );
}
