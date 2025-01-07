import { TestCase } from "@/server/schema/testcase.schema";
import { createContext, useContext, useState } from "react";
export type DialogType = "add" | "edit" | "delete";
interface TestcaseContextValue {
  selectedRow: TestCase | null | undefined;
  setSelectedRow: (testcase: TestCase | null) => void;
  open: DialogType | null;
  setOpen: (type: DialogType | null) => void;
}

const TestcaseContext = createContext<TestcaseContextValue | undefined>(
  undefined,
);

interface TestcaseProviderProps {
  children: React.ReactNode;
}

export function TestcaseProvider({ children }: TestcaseProviderProps) {
  const [selectedRow, setSelectedRow] = useState<TestCase | null | undefined>(
    null,
  );
  const [open, setOpen] = useState<DialogType | null>(null);
  return (
    <TestcaseContext.Provider
      value={{ selectedRow, setSelectedRow, open, setOpen }}
    >
      {children}
    </TestcaseContext.Provider>
  );
}

export function useTestcaseContext() {
  const context = useContext(TestcaseContext);
  if (context === undefined) {
    throw new Error(
      "useTestcaseContext must be used within a TestcaseProvider",
    );
  }
  return context;
}
