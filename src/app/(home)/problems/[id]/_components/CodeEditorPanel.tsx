// components/CodeEditorPanel.tsx
import { Editor } from "@monaco-editor/react";

interface CodeEditorPanelProps {
  language: string;
}

export function CodeEditorPanel({ language }: CodeEditorPanelProps) {
  return (
    <div className="h-full w-full flex-1">
      <Editor
        height="100%"
        language={language.toLowerCase()}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
        }}
      />
    </div>
  );
}
