const learningPath = {
  currentPath: "Cấu Trúc Dữ Liệu Cơ Bản",
  progress: 65,
  nextTopic: "Binary Search Tree",
  completedTopics: 13,
  totalTopics: 20,
};
const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="h-2 w-full rounded-full bg-gray-200">
    <div
      className="h-2 rounded-full bg-blue-600 transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);
export default function StudyPlan() {
  return null;
  // <Card className="p-4">
  //   <h3 className="mb-3 flex items-center text-lg font-semibold">
  //     <LuBookOpen className="mr-2 h-5 w-5 text-blue-600" />
  //     Lộ Trình Học Tập
  //   </h3>
  //   <div className="space-y-3">
  //     <div className="font-medium text-gray-900">
  //       {learningPath.currentPath}
  //     </div>
  //     <ProgressBar progress={learningPath.progress} />
  //     <div className="text-sm text-gray-600">
  //       {learningPath.completedTopics}/{learningPath.totalTopics} chủ đề
  //     </div>
  //     <div className="text-sm text-gray-600">
  //       Tiếp theo: {learningPath.nextTopic}
  //     </div>
  //     <Button variant="outline" className="w-full">
  //       Tiếp Tục Học
  //     </Button>
  //   </div>
  // </Card>
}
