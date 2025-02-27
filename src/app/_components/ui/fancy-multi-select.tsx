"use client";

import * as React from "react";
import { LuX as X } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/app/_lib/utils";

// Improved type definitions
export interface FancyMultiSelectOption {
  value: string;
  label: string;
}

export interface CreateNewProps {
  title?: string;
  titleDescription?: string;
  label?: string;
  placeholder?: string;
}

interface FancyMultiSelectProps {
  options: FancyMultiSelectOption[];
  selectedOptions: FancyMultiSelectOption[];
  onChange: React.Dispatch<React.SetStateAction<FancyMultiSelectOption[]>>;
  placeholder?: string;
  onBlur?: () => void;
  name?: string;
  disabled?: boolean;
  withCreateNew?: boolean;
  onCreateNew?: (label: string) => FancyMultiSelectOption;
  createNewProps?: CreateNewProps;
  floatingList?: boolean;
  className?: string;
}

// Separate Dialog Component
const CreateNewDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (label: string) => void;
  props: CreateNewProps;
}> = ({ open, onOpenChange, onSubmit, props }) => {
  const newLabelRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = React.useCallback(() => {
    if (newLabelRef.current?.value) {
      onSubmit(newLabelRef.current.value);
      newLabelRef.current.value = "";
    }
  }, [onSubmit]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{props.title || "Create new item"}</DialogTitle>
          <DialogDescription>
            {props.titleDescription || "Enter the name of the new item"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-item-name" className="text-right">
              {props.label || "Name"}
            </Label>
            <Input
              id="new-item-name"
              ref={newLabelRef}
              placeholder={props.placeholder || "Enter name"}
              className="col-span-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const FancyMultiSelect = React.forwardRef<
  HTMLInputElement,
  FancyMultiSelectProps
>(
  (
    {
      options,
      onChange,
      selectedOptions,
      placeholder,
      onBlur,
      name,
      disabled,
      withCreateNew,
      onCreateNew,
      createNewProps = {},
      floatingList = true,
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const [openCreateNew, setOpenCreateNew] = React.useState(false);

    const handleUnselect = React.useCallback(
      (option: FancyMultiSelectOption) => {
        onChange((prev) => prev.filter((s) => s.value !== option.value));
      },
      [onChange],
    );

    const availableOptions = React.useMemo(() => {
      return options.filter(
        (option) =>
          !selectedOptions.find((selected) => selected.value === option.value),
      );
    }, [options, selectedOptions]);

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = ref as React.RefObject<HTMLInputElement>;
        if (input?.current) {
          if (
            (e.key === "Delete" || e.key === "Backspace") &&
            input.current.value === ""
          ) {
            onChange((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
          if (e.key === "Escape") {
            input.current.blur();
          }
        }
      },
      [ref, onChange],
    );

    const handleCreateNew = React.useCallback(
      (label: string) => {
        const newOption = onCreateNew?.(label);
        if (newOption) {
          onChange((prev) => [...prev, newOption]);
          setOpenCreateNew(false);
        }
      },
      [onChange, onCreateNew],
    );

    return (
      <Command
        onKeyDown={handleKeyDown}
        className={cn("overflow-visible bg-transparent", className)}
        aria-label="Fancy multi-select"
      >
        {withCreateNew && (
          <CreateNewDialog
            open={openCreateNew}
            onOpenChange={setOpenCreateNew}
            onSubmit={handleCreateNew}
            props={createNewProps}
          />
        )}

        <div
          className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <div className="flex flex-wrap gap-1">
            {selectedOptions.map((option) => (
              <Badge
                key={option.value}
                variant="secondary"
                role="option"
                aria-selected="true"
              >
                {option.label}
                <button
                  type="button"
                  aria-label={`Remove ${option.label}`}
                  className="ml-1 rounded-full outline-hidden ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-3 w-3 text-muted-foreground transition-colors hover:text-foreground" />
                </button>
              </Badge>
            ))}
            <CommandPrimitive.Input
              ref={ref}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => {
                setOpen(false);
                onBlur?.();
              }}
              onFocus={() => setOpen(true)}
              name={name}
              placeholder={placeholder}
              disabled={disabled}
              aria-autocomplete="list"
              className="ml-2 flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div className="relative mt-2">
          <CommandList>
            {open && availableOptions.length > 0 && (
              <div
                className={cn(
                  "top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-hidden animate-in fade-in-0 zoom-in-95",
                  floatingList && "absolute",
                )}
                role="listbox"
              >
                <CommandGroup className="h-full max-h-[200px] overflow-auto">
                  {availableOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue("");
                        onChange((prev) => [...prev, option]);
                      }}
                      className="cursor-pointer"
                      role="option"
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                  {withCreateNew && (
                    <CommandItem
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => setOpenCreateNew(true)}
                      className="cursor-pointer"
                      role="option"
                    >
                      Create new item
                    </CommandItem>
                  )}
                </CommandGroup>
              </div>
            )}
          </CommandList>
        </div>
      </Command>
    );
  },
);

FancyMultiSelect.displayName = "FancyMultiSelect";
