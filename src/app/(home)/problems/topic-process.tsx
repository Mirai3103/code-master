import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import { LuBrainCircuit } from "react-icons/lu";
const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="h-2 w-full rounded-full bg-gray-200">
    <div
      className="h-2 rounded-full bg-blue-600 transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);
export default function TopicProcess() {
  return (
    <Card className="p-4">
      <h3 className="mb-4 flex items-center text-lg font-semibold">
        <LuBrainCircuit className="mr-2 h-5 w-5 text-blue-600" />
        Tiến Độ Theo Chủ Đề
      </h3>
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex justify-between">
            <span className="text-gray-600">Arrays & Strings</span>
            <span className="text-sm text-gray-600">75%</span>
          </div>
          <ProgressBar progress={75} />
        </div>
        <div>
          <div className="mb-2 flex justify-between">
            <span className="text-gray-600">Dynamic Programming</span>
            <span className="text-sm text-gray-600">45%</span>
          </div>
          <ProgressBar progress={45} />
        </div>
        <div>
          <div className="mb-2 flex justify-between">
            <span className="text-gray-600">Trees & Graphs</span>
            <span className="text-sm text-gray-600">60%</span>
          </div>
          <ProgressBar progress={60} />
        </div>
      </div>
      <Button variant="outline" className="mt-4 w-full">
        Xem Chi Tiết
      </Button>
    </Card>
  );
}
