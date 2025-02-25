// components/EditorToolbar.tsx
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LuCircleCheck as Check,
  LuCode as Code,
  LuSettings as Settings,
  LuCopy as Copy,
} from "react-icons/lu";
import { RiTestTubeFill as TestTube } from "react-icons/ri";
import { LanguageOfProblem } from "../types";

interface EditorToolbarProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  languagesOfProblem: LanguageOfProblem[];
  onRunCode: () => void;
  onSubmitCode?: () => void;
  isPending?: boolean;
}

export function EditorToolbar({
  selectedLanguage,
  setSelectedLanguage,
  languagesOfProblem,
  onRunCode,
  onSubmitCode,
  isPending = false,
}: EditorToolbarProps) {
  return (
    <div className="w-full border-b border-gray-200 bg-white p-1">
      <div className="flex items-center justify-between">
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-[180px]">
            <Code className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languagesOfProblem.map((lang) => (
              <SelectItem
                key={lang.languageId}
                value={lang.monacoCodeLanguage || "plaintext"}
              >
                {lang.name} {lang.version || ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={onRunCode}
            disabled={isPending}
          >
            <TestTube className="h-4 w-4" />
            {isPending ? "Đang chạy..." : "Chạy thử"}
          </Button>
          <Button className="gap-2" onClick={onSubmitCode} disabled={isPending}>
            <Check className="h-4 w-4" />
            Nộp bài
          </Button>
        </div>
      </div>
    </div>
  );
}
