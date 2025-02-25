import { useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";
import { cn } from "@/lib/utils";

interface CodeDisplayProps {
  content: string;
  maxHeight?: string;
  className?: string;
  isError?: boolean;
}

export function CodeDisplay({
  content,
  maxHeight = "300px",
  className,
  isError = false,
}: CodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div
      className={cn(
        "relative my-1 rounded-md border",
        className,

        isError ? "border-red-200 bg-red-50" : "bg-gray-50",
      )}
    >
      <pre
        className={`long-code-block relative overflow-auto whitespace-pre p-2 font-mono text-sm text-gray-800`}
        style={{ maxHeight }}
      >
        <button
          onClick={handleCopy}
          className="absolute right-0 top-0 flex items-center gap-1 rounded-md p-1 text-xs text-gray-500 hover:bg-gray-200 focus:outline-none"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <>
              <LuCheck size={14} className="text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <LuCopy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
        {content}
      </pre>
    </div>
  );
}
