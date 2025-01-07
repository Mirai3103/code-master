"use client";
import { Card, CardContent } from "@/components/ui/card";

export default function UserProcess() {
  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <h3 className="mb-4 font-semibold">Tiến độ</h3>
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Easy</span>
              <span className="text-green-600">15/50</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-green-500"
                style={{ width: "30%" }}
              ></div>
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Medium</span>
              <span className="text-yellow-600">8/30</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-yellow-500"
                style={{ width: "27%" }}
              ></div>
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Hard</span>
              <span className="text-red-600">2/20</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-red-500"
                style={{ width: "10%" }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
