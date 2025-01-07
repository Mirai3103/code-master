"use client";

import {
  EditorBubble,
  EditorContent,
  EditorRoot,
  type JSONContent,
} from "novel";
import React, { useState } from "react";
import { NodeSelector } from "./node-selector";
import { LinkSelector } from "./link-selector";
import { TextButtons } from "./text-buttons";
import { ColorSelector } from "./color-selector";
import { defaultExtensions } from "./extensions";
import { Placeholder } from "novel/extensions";
interface NovelEditorProps {
  onChange: (content: JSONContent) => void;
  content: JSONContent;
  placeholder?: string;
}
const NovelEditor = ({ onChange, content, placeholder }: NovelEditorProps) => {
  const extension = React.useMemo(() => {
    return [
      ...defaultExtensions,
      Placeholder.configure({
        placeholder: placeholder || "Nhấn vào đây để bắt đầu viết",
      }),
    ];
  }, [placeholder]);
  const [openNode, setOpenNode] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openColor, setOpenColor] = useState(false);

  return (
    <EditorRoot>
      <EditorContent
        onUpdate={(content) => {
          onChange(content.editor.getJSON());
        }}
        immediatelyRender={false}
        initialContent={content}
        extensions={extension}
      >
        <EditorBubble
          tippyOptions={{
            placement: true ? "bottom-start" : "top",
          }}
          className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl"
        >
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <TextButtons />
          <ColorSelector
            open={openColor}
            onOpenChange={setOpenColor}
            isOpen={openColor}
            setIsOpen={setOpenColor}
          />
        </EditorBubble>
      </EditorContent>
    </EditorRoot>
  );
};
export default NovelEditor;
