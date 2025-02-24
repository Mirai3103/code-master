import { DifficultyLevel } from "@/server/schema/enum";

export const getDifficultyColor = (difficulty: DifficultyLevel) => {
  switch (difficulty) {
    case DifficultyLevel.EASY:
      return "text-green-600";
    case DifficultyLevel.MEDIUM:
      return "text-yellow-600";
    case DifficultyLevel.HARD:
      return "text-red-600";
    default:
      return "";
  }
};

export const getDifficultyBg = (difficulty: DifficultyLevel) => {
  switch (difficulty) {
    case DifficultyLevel.EASY:
      return "bg-green-50";
    case DifficultyLevel.MEDIUM:
      return "bg-yellow-50";
    case DifficultyLevel.HARD:
      return "bg-red-50";
    default:
      return "";
  }
};

export const getDifficultyText = (difficulty: DifficultyLevel) => {
  switch (difficulty) {
    case DifficultyLevel.EASY:
      return "Dễ";
    case DifficultyLevel.MEDIUM:
      return "Trung Bình";
    case DifficultyLevel.HARD:
      return "Khó";
    default:
      return "";
  }
};
