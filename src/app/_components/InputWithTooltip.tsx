import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import React from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface InputWithTooltipProps extends React.ComponentProps<"input"> {
  popoverContent: string | React.ReactNode;
}

const InputWithTooltip = React.forwardRef<
  HTMLInputElement,
  InputWithTooltipProps
>(({ popoverContent, ...props }, ref) => {
  return (
    <Popover>
      <PopoverTrigger className="w-full">
        <Input ref={ref} {...props} />
      </PopoverTrigger>
      <PopoverContent align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
        {popoverContent}
      </PopoverContent>
    </Popover>
  );
});

export { InputWithTooltip };
